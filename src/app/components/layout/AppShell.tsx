import { Outlet, Link, useLocation } from 'react-router';
import { Brain, Library, Volume2, VolumeX } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ROUTES, isRouteActive } from '../../routePaths';
import { useQuizSounds } from '../../hooks/useQuizSounds';

export function AppShell() {
  const location = useLocation();
  const { enabled, toggleEnabled, playSelect } = useQuizSounds();

  const navItems = [
    { name: 'Chọn quiz', path: ROUTES.quizzes, icon: Library },
  ];

  const handleToggleSound = () => {
    toggleEnabled();
    playSelect();
  };

  return (
    <div className="flex h-screen bg-sky-50/70 text-slate-950 font-sans">
      <aside className="hidden md:flex flex-col w-72 bg-white/95 border-r border-sky-100 shadow-sm">
        <div className="p-6">
          <Link to={ROUTES.quizzes} className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Brain size={26} />
            </span>
            <span>
              <span className="block text-lg font-black leading-tight text-slate-950">Online Quiz</span>
              <span className="block text-sm font-bold text-sky-700">Learning</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isRouteActive(location.pathname, item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={playSelect}
                className={twMerge(
                  clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold',
                    isActive
                      ? 'bg-sky-100 text-sky-800 shadow-sm'
                      : 'text-slate-600 hover:bg-sky-50 hover:text-sky-800',
                  ),
                )}
              >
                <Icon size={20} className={isActive ? 'text-sky-700' : 'text-slate-400'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sky-100">
          <button
            type="button"
            onClick={handleToggleSound}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-bold text-slate-600 transition-colors hover:bg-sky-50 hover:text-sky-800"
          >
            {enabled ? <Volume2 size={20} className="text-sky-700" /> : <VolumeX size={20} className="text-slate-400" />}
            Sound {enabled ? 'On' : 'Off'}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      <nav className="md:hidden flex bg-white border-t border-sky-100">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isRouteActive(location.pathname, item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={playSelect}
              className={clsx(
                'flex-1 py-3 flex flex-col items-center justify-center gap-1 text-xs font-medium',
                isActive ? 'text-sky-700' : 'text-slate-500',
              )}
            >
              <Icon size={20} className={isActive ? 'text-sky-700' : 'text-slate-400'} />
              {item.name}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleToggleSound}
          className="flex-1 py-3 flex flex-col items-center justify-center gap-1 text-xs font-medium text-slate-500"
        >
          {enabled ? <Volume2 size={20} className="text-sky-700" /> : <VolumeX size={20} className="text-slate-400" />}
          Sound
        </button>
      </nav>
    </div>
  );
}
