import { useState } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addSkill, removeSkill, updateSkill } from "@reducers/levelingSlice";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SkillTree = () => {
  const dispatch = useAppDispatch();
  const skills = useAppSelector((state) => state.leveling.skills);
  const profile = useAppSelector((state) => state.leveling.profile);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  // Calculate XP progress for current level
  const calculateProgress = (xp: number, level: number) => {
    // Level formula: level n requires sum of (20 + (i-1)*10) for i from 1 to n
    let totalXpForCurrentLevel = 0;
    for (let i = 1; i < level; i++) {
      totalXpForCurrentLevel += 20 + (i - 1) * 10;
    }
    
    const xpInCurrentLevel = xp - totalXpForCurrentLevel;
    const xpRequiredForNextLevel = 20 + (level - 1) * 10;
    
    return {
      current: xpInCurrentLevel,
      required: xpRequiredForNextLevel,
      percentage: (xpInCurrentLevel / xpRequiredForNextLevel) * 100,
    };
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;

    const skillId = `skill-${Date.now()}`;
    dispatch(
      addSkill({
        id: skillId,
        name: newSkillName.trim(),
        category: newSkillCategory.trim() || "General",
        parentId: selectedParentId,
        children: [],
      })
    );

    // If this skill has a parent, update parent's children array
    if (selectedParentId && skills[selectedParentId]) {
      dispatch(
        updateSkill({
          id: selectedParentId,
          children: [...skills[selectedParentId].children, skillId],
        })
      );
    }

    setNewSkillName("");
    setNewSkillCategory("");
    setSelectedParentId(null);
    setShowAddDialog(false);
  };

  const handleRemoveSkill = (skillId: string) => {
    const skill = skills[skillId];
    if (!skill) return;

    // Remove this skill from parent's children if it has a parent
    if (skill.parentId && skills[skill.parentId]) {
      const parent = skills[skill.parentId];
      dispatch(
        updateSkill({
          id: skill.parentId,
          children: parent.children.filter((id) => id !== skillId),
        })
      );
    }

    // Remove all children recursively
    const removeChildren = (id: string) => {
      const s = skills[id];
      if (s) {
        s.children.forEach((childId) => removeChildren(childId));
        dispatch(removeSkill(id));
      }
    };

    skill.children.forEach((childId) => removeChildren(childId));
    dispatch(removeSkill(skillId));
  };

  // Get root skills (skills without parents)
  const rootSkills = Object.values(skills).filter((skill) => !skill.parentId);

  // Recursive component to render skill tree
  const SkillNode = ({ skillId, depth = 0 }: { skillId: string; depth?: number }) => {
    const skill = skills[skillId];
    if (!skill) return null;

    const progress = calculateProgress(skill.xp, skill.level);
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(skill.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className={`${depth > 0 ? 'ml-8 mt-2' : 'mt-4'}`}>
        <Card className="border-border/70 bg-card/60">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-lg">{skill.name}</h4>
                  <Badge variant="outline">Level {skill.level}</Badge>
                  <Badge variant="secondary">{skill.category}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {progress.current} / {progress.required} XP
                    </span>
                    <span>Total: {skill.xp} XP</span>
                  </div>
                  <Progress value={progress.percentage} className="h-2" />
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Last updated: {daysSinceUpdate === 0 ? 'Today' : `${daysSinceUpdate} day${daysSinceUpdate > 1 ? 's' : ''} ago`}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 ml-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setSelectedParentId(skillId);
                    setShowAddDialog(true);
                  }}
                  title="Add child skill"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveSkill(skillId)}
                  title="Remove skill"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {skill.children.length > 0 && (
          <div className="border-l-2 border-border/50 ml-4">
            {skill.children.map((childId) => (
              <SkillNode key={childId} skillId={childId} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Skill Tree</CardTitle>
              <CardDescription>
                Your skills organized in a tree structure
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Root Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Profile Section at the base */}
          {profile.userName && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{profile.userName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {profile.skillsCount} Skills | {profile.totalXp} Total XP
                </p>
              </div>
            </div>
          )}

          {/* Skill Tree Visualization */}
          {rootSkills.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No skills yet</p>
              <p className="text-sm">Click "Add Root Skill" to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rootSkills.map((skill) => (
                <SkillNode key={skill.id} skillId={skill.id} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Skill Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedParentId ? "Add Child Skill" : "Add Root Skill"}
            </DialogTitle>
            <DialogDescription>
              {selectedParentId
                ? `Add a sub-skill under ${skills[selectedParentId]?.name}`
                : "Add a new root skill to your tree"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="skill-name">Skill Name</Label>
              <Input
                id="skill-name"
                placeholder="e.g., React, Python, Communication"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSkill();
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skill-category">Category</Label>
              <Input
                id="skill-category"
                placeholder="e.g., Frontend, Backend, Soft Skills"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false);
                setNewSkillName("");
                setNewSkillCategory("");
                setSelectedParentId(null);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAddSkill} disabled={!newSkillName.trim()}>
              <Save className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillTree;
