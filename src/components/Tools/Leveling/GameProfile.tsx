import { useState } from "react";
import { Gamepad2, Settings as SettingsIcon, User, TreePine, MessageSquare, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "./Profile";
import Settings from "./Settings";
import SkillTree from "./SkillTree";
import AIChat from "./AIChat";
import ProgressTracking from "./ProgressTracking";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const GameProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Gamepad2 className="h-6 w-6 text-primary" />
            Game Profile & Skill Leveling
          </CardTitle>
          <CardDescription>
            Track your skills, gain XP, and level up your abilities with AI-powered insights
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            <span className="hidden sm:inline">Skills</span>
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Daily Log</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Profile />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillTree />
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <AIChat />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <ProgressTracking />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameProfile;
