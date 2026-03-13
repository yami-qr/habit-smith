import { SectionCard } from "@/components/shared/section-card";

export default function DashboardPage() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <SectionCard title="Welcome Back" subtitle="Your productivity command center is ready." />
      <SectionCard title="Today's Habits" subtitle="Track your top priorities and streak status." />
      <SectionCard title="Weekly Focus" subtitle="Visualize progress and consistency trends." />
    </div>
  );
}
