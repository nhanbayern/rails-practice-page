import { Outlet, Link, useLocation } from 'react-router';
import { Home, Library, User, PanelsTopLeft, TerminalSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function AppShell() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Study Slides', path: '/lessons', icon: PanelsTopLeft },
    { name: 'Live Coding', path: '/live-coding', icon: TerminalSquare },
    { name: 'Library', path: '/library', icon: Library },
  ];

  return (
    <div className="flex h-screen bg-red-50/40 text-slate-950 font-sans">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white/95 border-r border-red-100 shadow-sm">
        <div className="p-6 flex items-center justify-center text-red-700 font-bold text-lg leading-tight">
          <img src="/app-avatar.png" alt="Rails" className="h-14 w-28 shrink-0 object-contain" />
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={twMerge(
                  clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                    isActive 
                      ? "bg-red-50 text-red-800 shadow-sm" 
                      : "text-slate-600 hover:bg-red-50 hover:text-red-800"
                  )
                )}
              >
                <Icon size={20} className={isActive ? "text-red-700" : "text-slate-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-red-100">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-700">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold">Học viên Rails</p>
              <p className="text-xs text-slate-500">Practice Mode</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden flex bg-white border-t border-red-100">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={clsx(
                "flex-1 py-3 flex flex-col items-center justify-center gap-1 text-xs font-medium",
                isActive ? "text-red-700" : "text-slate-500"
              )}
            >
              <Icon size={20} className={isActive ? "text-red-700" : "text-slate-400"} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
