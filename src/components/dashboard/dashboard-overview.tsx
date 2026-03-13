"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Flame, ListTodo } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";

import { PremiumUpgradeCard } from "@/components/billing/premium-upgrade-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { StreakCard } from "@/components/dashboard/streak-card";
import { HabitCard } from "@/components/habits/habit-card";
import { ChartCard } from "@/components/shared/chart-card";
import { ActivityFeed } from "@/components/social/activity-feed";
import { LeaderboardList } from "@/components/social/leaderboard-list";
import { services } from "@/services";
import { useSessionStore } from "@/stores/session-store";
import type { ActivityItem, DashboardStats, Habit, HabitLog, LeaderboardEntry } from "@/types";

const EMPTY_STATS: DashboardStats = {
  activeHabits: 0,
  completedToday: 0,
  currentBestStreak: 0,
  completionRate: 0,
};

export function DashboardOverview() {
  const session = useSessionStore((state) => state.session);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<Array<{ date: string; completions: number }>>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<Array<{ week: string; completionRate: number }>>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user.id) return;

      const userId = session.user.id;
      const [nextStats, nextHabits, nextLogs, nextWeekly, nextMonthly, nextActivity, nextLeaderboard] = await Promise.all([
        services.analytics.getDashboardStats(userId),
        services.habits.getHabits(userId),
        services.habits.getHabitLogs(userId),
        services.analytics.getWeeklyTrend(userId),
        services.analytics.getMonthlyTrend(userId),
        services.social.getActivityFeed(userId),
        services.analytics.getLeaderboardPreview(userId),
      ]);

      setStats(nextStats);
      setHabits(nextHabits.filter((habit) => !habit.archived));
      setLogs(nextLogs);
      setWeeklyTrend(nextWeekly);
      setMonthlyTrend(nextMonthly);
      setActivity(nextActivity);
      setLeaderboard(nextLeaderboard);
    };

    void loadData();
  }, [session?.user.id]);

  const completionBars = useMemo(
    () => [
      { label: "Completion rate", value: stats.completionRate },
      { label: "Weekly momentum", value: Math.min(100, stats.completionRate + 9) },
      { label: "Monthly consistency", value: Math.min(100, stats.completionRate + 4) },
    ],
    [stats.completionRate],
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Active Habits" value={stats.activeHabits} icon={<ListTodo className="h-4 w-4" />} />
        <StatCard title="Completed Today" value={stats.completedToday} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard title="Consistency" value={`${stats.completionRate}%`} icon={<BarChart3 className="h-4 w-4" />} />
        <StreakCard title="Best Streak" current={stats.currentBestStreak} longest={42} />
      </div>

      <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Today&apos;s Habits</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {habits.slice(0, 6).map((habit) => (
            <HabitCard key={habit.id} habit={habit} logs={logs} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Completion Progress</h2>
        <div className="mt-4 space-y-4">
          {completionBars.map((bar) => (
            <div key={bar.label}>
              <div className="flex items-center justify-between text-sm">
                <p className="text-zinc-600">{bar.label}</p>
                <p className="font-semibold text-zinc-900">{bar.value}%</p>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div className="h-full rounded-full bg-zinc-900" style={{ width: `${bar.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Weekly Completion" subtitle="Daily completions over the last 7 days.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="completions" stroke="#111827" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Trend" subtitle="Completion rate over recent weeks.">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="completionRate" stroke="#0f172a" fill="#d4d4d8" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ActivityFeed items={activity} />
        </div>
        <LeaderboardList entries={leaderboard} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Quick Add Habit</h2>
          <p className="mt-2 text-sm text-zinc-600">Use the Habits page to create and customize new routines quickly.</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
            <Flame className="h-4 w-4" /> Keep streak momentum by adding one new habit today.
          </div>
        </section>
        <PremiumUpgradeCard />
      </div>
    </div>
  );
}
