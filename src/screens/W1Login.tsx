import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

/**
 * W1 — Login. FIX A1: Sign In is primary button; Create Account is a text link
 * below (clear visual hierarchy). FIX A3: empty placeholders, not pre-filled.
 */
export function W1Login() {
  const navigate = useNavigate();
  const setPlayer = useStore((s) => s.setPlayer);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'create'>('signin');
  const [name, setName] = useState('');

  function submit() {
    const finalName = name || (email.split('@')[0] || 'Player');
    setPlayer(finalName, email || 'player@rtu.lv');
    navigate('/');
  }

  return (
    <div className="h-full flex justify-center bg-bg">
      <div className="w-full max-w-[440px] h-full flex flex-col bg-white">
        <div className="h-[200px] bg-gradient-to-br from-teal to-teal-med text-white flex flex-col items-center justify-center">
          <div className="text-[34px] font-extrabold tracking-[2px] leading-tight">XP</div>
          <div className="text-[34px] font-extrabold tracking-[2px] leading-tight">ARCHITECT</div>
          <div className="text-[11px] tracking-[3px] mt-2 opacity-85">DESIGN THE EXPERIENCE</div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <h2 className="h1">{mode === 'signin' ? 'Sign in' : 'Create account'}</h2>
          <p className="muted mb-3">
            {mode === 'signin'
              ? 'Welcome back, architect.'
              : 'Make a profile to track your sessions.'}
          </p>
          {mode === 'create' && (
            <>
              <div className="lbl">Display name</div>
              <input
                className="input"
                placeholder="e.g. Temur"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}
          <div className="lbl">Email</div>
          <input
            type="email"
            className="input"
            placeholder="you@rtu.lv"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <div className="lbl">Password</div>
          <input
            type="password"
            className="input"
            placeholder="Anything works in the prototype"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button onClick={submit} className="btn-primary w-full mt-2">
            {mode === 'signin' ? 'Sign in →' : 'Create account →'}
          </button>
          <div className="text-center mt-4">
            {mode === 'signin' ? (
              <span className="text-[12px] text-gray">
                New here?{' '}
                <button onClick={() => setMode('create')} className="btn-text text-[12px]">
                  Create an account
                </button>
              </span>
            ) : (
              <span className="text-[12px] text-gray">
                Have an account?{' '}
                <button onClick={() => setMode('signin')} className="btn-text text-[12px]">
                  Sign in instead
                </button>
              </span>
            )}
          </div>
          <p className="muted mt-5 text-center">
            Prototype — no real authentication. Any email and password works.
          </p>
        </div>
      </div>
    </div>
  );
}
