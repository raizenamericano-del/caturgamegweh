import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SkyShader from '@/components/SkyShader';
import FloatingParticles from '@/components/FloatingParticles';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SettingsModal from '@/components/SettingsModal';
import type { GameMode, BoardTheme } from '@/components/SettingsModal';
import ChessBoard from '@/components/ChessBoard';
import FeatureShowcase from '@/components/FeatureShowcase';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gameSettings, setGameSettings] = useState<{
    mode: GameMode;
    difficulty: number;
    boardTheme: BoardTheme;
  } | null>(null);
  const gameSectionRef = useRef<HTMLDivElement>(null);

  const handleStartGame = () => {
    setSettingsOpen(true);
  };

  const handleSettingsSubmit = (settings: {
    mode: GameMode;
    difficulty: number;
    boardTheme: BoardTheme;
  }) => {
    setGameSettings(settings);
    // Scroll to game section after a short delay
    setTimeout(() => {
      gameSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-black text-white font-outfit overflow-x-hidden">
      {/* Background layers */}
      <SkyShader />
      <FloatingParticles />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-10">
        <HeroSection onStartGame={handleStartGame} />

        {/* Game Board Section */}
        <section
          id="game"
          ref={gameSectionRef}
          className="relative py-16 sm:py-24 px-4 sm:px-6"
        >
          <div className="max-w-[1280px] mx-auto">
            {/* Section header */}
            <div className="text-center mb-10">
              <h2 className="text-[clamp(2rem,5vw,3rem)] font-outfit font-medium text-white">
                Papan <span className="text-[#f6b846]">Catur</span>
              </h2>
              <p className="mt-2 text-white/60 font-outfit font-light">
                {gameSettings
                  ? `Mode: ${gameSettings.mode === 'computer' ? 'VS Komputer' : gameSettings.mode === 'online' ? 'Online' : 'Berteman'} | Level ${gameSettings.difficulty} | Tema: ${gameSettings.boardTheme.charAt(0).toUpperCase() + gameSettings.boardTheme.slice(1)}`
                  : 'Pilih mode permainan untuk memulai'}
              </p>
              {!gameSettings && (
                <button
                  onClick={handleStartGame}
                  className="mt-4 inline-flex items-center gap-2 bg-[#f6b846] text-black font-outfit font-medium px-6 py-2.5 rounded hover:brightness-110 hover:-translate-y-0.5 transition-all duration-200 text-sm"
                >
                  Konfigurasi Permainan
                </button>
              )}
            </div>

            {/* Chess Board */}
            <ChessBoard boardTheme={gameSettings?.boardTheme || 'classic'} />
          </div>
        </section>

        {/* Feature Showcase */}
        <FeatureShowcase />

        {/* CTA Section */}
        <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: 'url(/assets/castle-silhouette.jpg)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

          <div className="relative z-10 max-w-[1280px] mx-auto text-center">
            <img
              src="/assets/knight-gold.png"
              alt="Gold Knight"
              className="w-16 h-16 mx-auto mb-6 opacity-80"
            />
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-outfit font-medium text-white leading-tight">
              Siap untuk Menjadi{' '}
              <span className="text-[#f6b846]">Grandmaster</span>?
            </h2>
            <p className="mt-4 text-white/60 font-outfit font-light max-w-lg mx-auto">
              Bergabung dengan ribuan pemain di seluruh dunia. Latih strategi,
              pelajari taktik baru, dan naik peringkat!
            </p>
            <button
              onClick={handleStartGame}
              className="mt-8 inline-flex items-center gap-2 bg-[#f6b846] text-black font-outfit font-medium px-10 py-4 rounded-lg hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-lg"
            >
              Mulai Bermain Gratis
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSubmit={handleSettingsSubmit}
      />
    </div>
  );
}
