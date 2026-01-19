import { useState } from "react";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updateSettings } from "@reducers/levelingSlice";

const Settings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.leveling.settings);

  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    dispatch(updateSettings(localSettings));
  };

  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          Settings
        </CardTitle>
        <CardDescription>
          Configure peer connection, sync, and AI model settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sync Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Sync Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="peer-connection">Peer Connection</Label>
                <p className="text-xs text-muted-foreground">
                  Enable WebRTC peer-to-peer connections
                </p>
              </div>
              <Switch
                id="peer-connection"
                checked={localSettings.peerConnectionEnabled}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, peerConnectionEnabled: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-sync">Auto Sync</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically sync data with connected peers
                </p>
              </div>
              <Switch
                id="auto-sync"
                checked={localSettings.autoSyncEnabled}
                onCheckedChange={(checked) =>
                  setLocalSettings({ ...localSettings, autoSyncEnabled: checked })
                }
              />
            </div>
          </div>
        </div>

        {/* AI Model Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            AI Model Settings
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-url">AI Model URL</Label>
              <Input
                id="ai-url"
                type="text"
                placeholder="http://localhost:11434"
                value={localSettings.aiModelUrl}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, aiModelUrl: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Ollama API endpoint or compatible AI service URL
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-model">Model Name</Label>
              <Input
                id="ai-model"
                type="text"
                placeholder="llama2"
                value={localSettings.aiModelName}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, aiModelName: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Model name (e.g., llama2, mistral, codellama)
              </p>
            </div>
          </div>
        </div>

        {/* XP Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            XP Settings
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="daily-xp">Daily XP Gain</Label>
              <Input
                id="daily-xp"
                type="number"
                min="1"
                value={localSettings.dailyXpGain}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    dailyXpGain: parseInt(e.target.value) || 10,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                XP gained for working on a skill each day
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="penalty">Missed Day Penalty</Label>
              <Input
                id="penalty"
                type="number"
                min="0"
                value={localSettings.missedDayPenalty}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    missedDayPenalty: parseInt(e.target.value) || 20,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                XP lost when a day is missed or skill not mentioned
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default Settings;
