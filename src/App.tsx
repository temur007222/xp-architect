import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { W1Login } from './screens/W1Login';
import { W2Home } from './screens/W2Home';
import { W3Setup } from './screens/W3Setup';
import { W4Play } from './screens/W4Play';
import { W5Final } from './screens/W5Final';
import { W6Summary } from './screens/W6Summary';
import { W8Leaderboard } from './screens/W8Leaderboard';
import { W9Profile } from './screens/W9Profile';
import { W10History } from './screens/W10History';
import { W10HistoryDetail } from './screens/W10HistoryDetail';
import { W11Settings } from './screens/W11Settings';
import { W12Tutorial } from './screens/W12Tutorial';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const player = useStore((s) => s.player);
  if (!player) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<W1Login />} />
        <Route path="/" element={<RequireAuth><W2Home /></RequireAuth>} />
        <Route path="/play/setup" element={<RequireAuth><W3Setup /></RequireAuth>} />
        <Route path="/play" element={<RequireAuth><W4Play /></RequireAuth>} />
        <Route path="/play/final" element={<RequireAuth><W5Final /></RequireAuth>} />
        <Route path="/play/summary" element={<RequireAuth><W6Summary /></RequireAuth>} />
        <Route path="/leaderboard" element={<RequireAuth><W8Leaderboard /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><W9Profile /></RequireAuth>} />
        <Route path="/history" element={<RequireAuth><W10History /></RequireAuth>} />
        <Route path="/history/:sessionId" element={<RequireAuth><W10HistoryDetail /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><W11Settings /></RequireAuth>} />
        <Route path="/tutorial" element={<RequireAuth><W12Tutorial /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
