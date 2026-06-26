import { Crown } from 'lucide-react';

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative z-10 bg-black border-t border-white/10 py-10 px-4 sm:px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-[#f6b846]" />
            <span className="text-lg font-outfit font-medium text-[#f6b846]">
              RoyalKyy Chess
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollTo('hero')}
              className="text-sm text-white/50 hover:text-[#f6b846] transition-colors duration-200 font-outfit"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollTo('game')}
              className="text-sm text-white/50 hover:text-[#f6b846] transition-colors duration-200 font-outfit"
            >
              Main
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="text-sm text-white/50 hover:text-[#f6b846] transition-colors duration-200 font-outfit"
            >
              Fitur
            </button>
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/30 font-outfit">
            &copy; 2026 RoyalKyy Chess. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
