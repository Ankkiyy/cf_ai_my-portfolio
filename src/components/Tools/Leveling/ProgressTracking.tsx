import { useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector } from "@store/hooks";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ProgressTracking = () => {
  const skills = useAppSelector((state) => state.leveling.skills);
  const dailyLogs = useAppSelector((state) => state.leveling.dailyLogs);
  const [timeRange, setTimeRange] = useState<"daily" | "monthly">("daily");

  // Prepare data for daily progress (last 7 days)
  const getDailyData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const logsForDay = dailyLogs.filter((log) => {
        const logDate = new Date(log.date).toISOString().split('T')[0];
        return logDate === dateStr;
      });
      
      const totalXpGained = logsForDay.reduce((sum, log) => {
        return sum + log.processedSkills.length * 10; // Assuming 10 XP per skill
      }, 0);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        xp: totalXpGained,
        skills: logsForDay.reduce((sum, log) => sum + log.processedSkills.length, 0),
      });
    }
    
    return data;
  };

  // Prepare data for monthly progress (last 6 months)
  const getMonthlyData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const logsForMonth = dailyLogs.filter((log) => {
        const logDate = new Date(log.date);
        const logMonthStr = `${logDate.getFullYear()}-${String(logDate.getMonth() + 1).padStart(2, '0')}`;
        return logMonthStr === monthStr;
      });
      
      const totalXpGained = logsForMonth.reduce((sum, log) => {
        return sum + log.processedSkills.length * 10;
      }, 0);
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        xp: totalXpGained,
        logs: logsForMonth.length,
      });
    }
    
    return data;
  };

  // Prepare skill distribution data
  const getSkillDistribution = () => {
    return Object.values(skills)
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10) // Top 10 skills
      .map((skill) => ({
        name: skill.name.length > 15 ? skill.name.substring(0, 15) + '...' : skill.name,
        xp: skill.xp,
        level: skill.level,
      }));
  };

  const dailyData = getDailyData();
  const monthlyData = getMonthlyData();
  const skillDistribution = getSkillDistribution();

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progress Tracking
          </CardTitle>
          <CardDescription>
            Monitor your skill development over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as "daily" | "monthly")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="xp" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="XP Gained"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="skills" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      name="Skills Worked On"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Last 7 days of activity
              </p>
            </TabsContent>
            
            <TabsContent value="monthly" className="space-y-4">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="month" 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="xp" 
                      fill="hsl(var(--primary))" 
                      name="Total XP"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar 
                      dataKey="logs" 
                      fill="hsl(var(--chart-2))" 
                      name="Daily Logs"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Last 6 months of activity
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Skills
          </CardTitle>
          <CardDescription>
            Your highest XP skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skillDistribution.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No skills yet. Add some skills to see your progress!
            </p>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    type="number"
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    width={120}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="xp" 
                    fill="hsl(var(--primary))" 
                    name="XP"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracking;
