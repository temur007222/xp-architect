import { Menu, User as UserIcon, ArrowLeft } from 'lucide-react';

interface TopBarProps {
  title: string;
  onMenu?: () => void;
  onProfile?: () => void;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
}

export function TopBar({ title, onMenu, onProfile, onBack, rightSlot }: TopBarProps) {
  return (
    <div className="h-12 px-3 flex items-center bg-teal text-white shrink-0 border-b border-teal-med/20">
      {onBack ? (
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/15"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
      ) : (
        <button
          onClick={onMenu}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/15"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
      )}
      <h1 className="flex-1 text-center font-bold text-[15px] tracking-[0.3px]">{title}</h1>
      {rightSlot ?? (
        <button
          onClick={onProfile}
          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/15"
          aria-label="Profile"
        >
          <UserIcon size={18} />
        </button>
      )}
    </div>
  );
}
