import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Home,
  Play,
  History as HistoryIcon,
  Trophy,
  User as UserIcon,
  BookOpen,
  Settings as SettingsIcon,
  LogOut,
} from 'lucide-react';

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const navigate = useNavigate();
  const player = useStore((s) => s.player);
  const signOut = useStore((s) => s.signOut);

  if (!open) return null;

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleSignOut = () => {
    signOut();
    onClose();
    navigate('/login');
  };

  const items: { label: string; icon: React.ReactNode; path: string }[] = [
    { label: 'Home', icon: <Home size={16} />, path: '/' },
    { label: 'Play', icon: <Play size={16} />, path: '/play/setup' },
    { label: 'Player History', icon: <HistoryIcon size={16} />, path: '/history' },
    { label: 'Leaderboard', icon: <Trophy size={16} />, path: '/leaderboard' },
    { label: 'Profile', icon: <UserIcon size={16} />, path: '/profile' },
    { label: 'How to Play', icon: <BookOpen size={16} />, path: '/tutorial' },
    { label: 'Settings', icon: <SettingsIcon size={16} />, path: '/settings' },
  ];

  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
        aria-label="Close menu"
      />
      <aside className="absolute left-0 top-0 bottom-0 w-[78%] max-w-[320px] bg-white text-dark shadow-2xl animate-slide-in-left flex flex-col">
        <div className="bg-teal text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-[15px] font-bold">
            {(player?.name?.[0] ?? 'P').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[13px] truncate">{player?.name ?? 'Guest'}</div>
            <div className="text-[11px] opacity-85">
              Level {player?.level ?? 1} · {player?.xp ?? 0} XP
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {items.map((it) => (
            <button
              key={it.path}
              onClick={() => go(it.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] hover:bg-teal-faint transition-colors"
            >
              <span className="text-teal">{it.icon}</span>
              <span className="font-semibold">{it.label}</span>
            </button>
          ))}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-[13px] hover:bg-teal-faint transition-colors border-t border-gray-line mt-2"
          >
            <span className="text-bad">
              <LogOut size={16} />
            </span>
            <span className="font-semibold">Sign Out</span>
          </button>
        </nav>
        <div className="p-3 text-[10px] text-gray text-center border-t border-gray-line">
          XP Architect · Task 11 Prototype
        </div>
      </aside>
    </div>
  );
}
