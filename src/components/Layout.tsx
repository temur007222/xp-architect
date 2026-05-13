import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { NavDrawer } from './NavDrawer';

interface LayoutProps {
  title: string;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  hideTopBar?: boolean;
  children: React.ReactNode;
}

export function Layout({ title, onBack, rightSlot, hideTopBar, children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-full flex justify-center bg-bg">
      <div className="w-full max-w-[440px] h-full flex flex-col bg-white shadow-2xl">
        {!hideTopBar && (
          <TopBar
            title={title}
            onMenu={() => setMenuOpen(true)}
            onProfile={() => navigate('/profile')}
            onBack={onBack}
            rightSlot={rightSlot}
          />
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
      <NavDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
