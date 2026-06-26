import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Monitor, Globe, Users } from 'lucide-react';

export type GameMode = 'computer' | 'online' | 'friend';
export type BoardTheme = 'classic' | 'sage' | 'slate' | 'rose';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (settings: {
    mode: GameMode;
    difficulty: number;
    boardTheme: BoardTheme;
  }) => void;
}

const modes: { id: GameMode; label: string; icon: typeof Monitor }[] = [
  { id: 'computer', label: 'VS Komputer', icon: Monitor },
  { id: 'online', label: 'Online', icon: Globe },
  { id: 'friend', label: 'Berteman', icon: Users },
];

const themes: { id: BoardTheme; dark: string; light: string; label: string }[] = [
  { id: 'classic', dark: '#b58863', light: '#f0d9b5', label: 'Classic' },
  { id: 'sage', dark: '#90ac78', light: '#cdd7c0', label: 'Sage' },
  { id: 'slate', dark: '#6582a4', light: '#b9c6d7', label: 'Slate' },
  { id: 'rose', dark: '#ce7c7c', light: '#e8c8c8', label: 'Rose' },
];

const difficultyLabels: Record<number, string> = {
  1: 'Pemula',
  2: 'Novice',
  3: 'Amatir',
  4: 'Menengah',
  5: 'Lanjutan',
  6: 'Ahli',
  7: 'Master',
  8: 'Grandmaster',
  9: 'Ultra',
  10: 'Legenda',
};

export default function SettingsModal({ isOpen, onClose, onSubmit }: SettingsModalProps) {
  const [mode, setMode] = useState<GameMode>('computer');
  const [difficulty, setDifficulty] = useState(3);
  const [boardTheme, setBoardTheme] = useState<BoardTheme>('classic');
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        panelRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    gsap.to(panelRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  const handleSubmit = () => {
    onSubmit({ mode, difficulty, boardTheme });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm opacity-0"
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        className="w-full max-w-[480px] bg-[rgba(0,0,0,0.92)] border border-white/10 rounded-xl p-6 sm:p-8 opacity-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-outfit font-medium text-white">
            Pengaturan Permainan
          </h2>
          <button
            onClick={handleClose}
            className="text-white/50 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm text-white/60 mb-3 font-outfit">
            Mode Permainan
          </label>
          <div className="grid grid-cols-3 gap-2">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-xs font-outfit font-medium transition-all duration-200 ${
                  mode === m.id
                    ? 'bg-[#f6b846] text-black border-[#f6b846]'
                    : 'bg-transparent text-white border-white/20 hover:border-white/40'
                }`}
              >
                <m.icon className="w-5 h-5" />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Slider */}
        {mode === 'computer' && (
          <div className="mb-6">
            <label className="block text-sm text-white/60 mb-3 font-outfit">
              Tingkat Kesulitan
            </label>
            <div className="px-1">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full h-1.5 bg-white/15 rounded-full appearance-none cursor-pointer accent-[#f6b846]"
                style={{
                  accentColor: '#f6b846',
                }}
              />
            </div>
            <div className="flex justify-between mt-2 px-1">
              <span className="text-[10px] text-white/40">1</span>
              <span className="text-xs text-[#f6b846] font-outfit font-medium">
                Level {difficulty} - {difficultyLabels[difficulty]}
              </span>
              <span className="text-[10px] text-white/40">10</span>
            </div>
          </div>
        )}

        {/* Board Theme Selection */}
        <div className="mb-6">
          <label className="block text-sm text-white/60 mb-3 font-outfit">
            Tema Papan
          </label>
          <div className="flex gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setBoardTheme(t.id)}
                className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                  boardTheme === t.id
                    ? 'border-[#f6b846] shadow-[0_0_12px_rgba(246,184,70,0.4)] scale-110'
                    : 'border-transparent hover:border-white/30'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${t.dark} 50%, ${t.light} 50%)`,
                }}
                title={t.label}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-white/40 font-outfit">
            {themes.find((t) => t.id === boardTheme)?.label}
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#f6b846] text-black font-outfit font-medium py-3 rounded hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200"
        >
          Mulai Bermain
        </button>
      </div>
    </div>
  );
}
