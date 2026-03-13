import { Bell, Plus, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex max-w-xl flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            aria-label="Search"
            className="w-full bg-transparent text-sm text-zinc-700 outline-none"
            placeholder="Search habits, friends, or insights"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 transition hover:text-zinc-900"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            <Plus className="h-4 w-4" />
            Quick Add
          </button>
        </div>
      </div>
    </header>
  );
}
