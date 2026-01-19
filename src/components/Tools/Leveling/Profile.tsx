import { useState } from "react";
import { User, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setUserName } from "@reducers/levelingSlice";

const Profile = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.leveling.profile);

  const [localUserName, setLocalUserName] = useState(profile.userName);

  const handleSave = () => {
    dispatch(setUserName(localUserName));
  };

  return (
    <Card className="border-border/70 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Configuration
        </CardTitle>
        <CardDescription>
          Set up your profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-name">Your Name</Label>
            <Input
              id="user-name"
              type="text"
              placeholder="Enter your name"
              value={localUserName}
              onChange={(e) => setLocalUserName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This will be displayed on your skill tree
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Total XP</p>
              <p className="text-2xl font-bold text-primary">{profile.totalXp}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Skills Count</p>
              <p className="text-2xl font-bold text-primary">{profile.skillsCount}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Member Since</p>
            <p className="text-sm">
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default Profile;
