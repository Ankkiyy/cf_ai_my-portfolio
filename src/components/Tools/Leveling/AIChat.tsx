import { useState } from "react";
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addDailyLog, addXpToSkill, degradeSkill } from "@reducers/levelingSlice";
import { toast } from "sonner";

const AIChat = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.leveling.settings);
  const skills = useAppSelector((state) => state.leveling.skills);
  const lastCheckDate = useAppSelector((state) => state.leveling.lastCheckDate);

  const [dailyLog, setDailyLog] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const checkForMissedDays = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastCheck = new Date(lastCheckDate);
    lastCheck.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastCheck.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff > 1) {
      // Missed days detected
      return daysDiff - 1; // Subtract 1 because today doesn't count as missed
    }
    return 0;
  };

  const processWithAI = async (text: string): Promise<string[]> => {
    try {
      // Sanitize input to prevent prompt injection
      const sanitizedText = text
        .replace(/[<>]/g, '') // Remove potential HTML/XML tags
        .replace(/```/g, '') // Remove code block markers
        .trim()
        .slice(0, 2000); // Limit length

      if (!sanitizedText) {
        return [];
      }

      const response = await fetch(`${settings.aiModelUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: settings.aiModelName,
          prompt: `Analyze the following daily log and identify which skills were worked on. Only return skill names that were actually mentioned or implied, separated by commas. Skills available: ${Object.values(skills).map(s => s.name).join(', ')}.\n\nDaily log: ${sanitizedText}\n\nSkills worked on (comma-separated):`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI model request failed with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const skillsText = data.response.trim();
      
      // Parse the AI response to extract skill names
      const mentionedSkills = skillsText
        .split(',')
        .map((s: string) => s.trim().toLowerCase())
        .filter((s: string) => s.length > 0);

      // Match mentioned skills with actual skill names
      const matchedSkillIds: string[] = [];
      Object.entries(skills).forEach(([id, skill]) => {
        if (mentionedSkills.some((mentioned: string) => 
          skill.name.toLowerCase().includes(mentioned) || 
          mentioned.includes(skill.name.toLowerCase())
        )) {
          matchedSkillIds.push(id);
        }
      });

      return matchedSkillIds;
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('AI processing failed. Using manual detection.');
      
      // Fallback: simple keyword matching
      const logLower = text.toLowerCase();
      const matchedSkillIds: string[] = [];
      
      Object.entries(skills).forEach(([id, skill]) => {
        if (logLower.includes(skill.name.toLowerCase())) {
          matchedSkillIds.push(id);
        }
      });
      
      return matchedSkillIds;
    }
  };

  const handleSubmitLog = async () => {
    if (!dailyLog.trim()) {
      toast.error("Please write something in your daily log");
      return;
    }

    setIsProcessing(true);

    try {
      // Check for missed days first
      const missedDays = checkForMissedDays();
      if (missedDays > 0) {
        toast.warning(`You missed ${missedDays} day${missedDays > 1 ? 's' : ''}! All skills degraded.`);
        
        // Apply penalty to all skills
        Object.keys(skills).forEach((skillId) => {
          dispatch(degradeSkill(skillId));
        });
      }

      // Process the log with AI
      const workedOnSkillIds = await processWithAI(dailyLog);

      if (workedOnSkillIds.length === 0) {
        toast.warning("No skills detected in your log. All skills degraded.");
        // Degrade all skills if none were mentioned
        Object.keys(skills).forEach((skillId) => {
          dispatch(degradeSkill(skillId));
        });
      } else {
        // Add XP to worked-on skills
        workedOnSkillIds.forEach((skillId) => {
          dispatch(addXpToSkill({ skillId, xp: settings.dailyXpGain }));
        });

        // Degrade skills that weren't mentioned
        const skillsNotWorkedOn = Object.keys(skills).filter(
          (id) => !workedOnSkillIds.includes(id)
        );
        skillsNotWorkedOn.forEach((skillId) => {
          dispatch(degradeSkill(skillId));
        });

        toast.success(
          `Updated ${workedOnSkillIds.length} skill${workedOnSkillIds.length > 1 ? 's' : ''} (+${settings.dailyXpGain} XP each)`
        );
      }

      // Save the daily log
      dispatch(
        addDailyLog({
          date: new Date().toISOString(),
          content: dailyLog,
          processedSkills: workedOnSkillIds,
        })
      );

      setDailyLog("");
    } catch (error) {
      console.error('Error processing daily log:', error);
      toast.error("Failed to process daily log");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Daily Log
        </CardTitle>
        <CardDescription>
          Describe your day and let AI update your skill tree
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Today I worked on React components, debugged some Python scripts, and had a great team meeting where I practiced my communication skills..."
            value={dailyLog}
            onChange={(e) => setDailyLog(e.target.value)}
            rows={8}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Mention the skills you worked on today. Skills not mentioned will degrade by {settings.missedDayPenalty} XP.
          </p>
        </div>

        <Button
          onClick={handleSubmitLog}
          disabled={isProcessing || !dailyLog.trim()}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing with AI...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Process Daily Log
            </>
          )}
        </Button>

        <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>AI analyzes your log to identify skills you worked on</li>
            <li>Mentioned skills gain +{settings.dailyXpGain} XP</li>
            <li>Unmentioned skills lose -{settings.missedDayPenalty} XP</li>
            <li>Missing a full day degrades all skills</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
