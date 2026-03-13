"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesCombined,
  Crown,
  Home,
  Medal,
  Settings,
  Sparkles,
  Target,
  Users,
  UserRound,
} from "lucide-react";

import { dashboardNavItems } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

const icons = {
  Overview: Home,
  Habits: Target,
  Analytics: ChartNoAxesCombined,
  Social: Users,
  Leaderboard: Medal,
  Profile: UserRound,
  Settings,
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/50 bg-white/80 p-6 backdrop-blur lg:block">
      <Link href="/" className="mb-10 flex items-center gap-3">
        <div className="grid h-10 w-10 place-content-center rounded-xl bg-zinc-900 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold tracking-tight text-zinc-900">HabitSmith</p>
          <p className="text-xs text-zinc-500">Forge better routines</p>
        </div>
      </Link>

      <nav className="space-y-1">
        {dashboardNavItems.map((item) => {
          const Icon = icons[item.label as keyof typeof icons];
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-zinc-900 text-white shadow-lg"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-700 p-4 text-white shadow-xl">
        <p className="text-sm font-semibold">Go Premium</p>
        <p className="mt-1 text-xs text-zinc-200">
          Unlock advanced analytics and social accountability tools.
        </p>
        <Link
          href="/pricing"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-900"
        >
          <Crown className="h-3.5 w-3.5" />
          Upgrade Plan
        </Link>
      </div>
    </aside>
  );
}
