import { useState, useEffect } from 'react';
import { Crown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Crown className="w-6 h-6 text-[#f6b846]" />
            <span className="text-xl font-outfit font-medium text-[#f6b846]">
              RoyalKyy Chess
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('hero')}
              className="text-sm text-white/80 hover:text-[#f6b846] transition-colors duration-200"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollTo('game')}
              className="text-sm text-white/80 hover:text-[#f6b846] transition-colors duration-200"
            >
              Main
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="text-sm text-white/80 hover:text-[#f6b846] transition-colors duration-200"
            >
              Fitur
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollTo('hero')}
              className="block w-full text-left text-white/80 hover:text-[#f6b846] py-2"
            >
              Beranda
            </button>
            <button
              onClick={() => scrollTo('game')}
              className="block w-full text-left text-white/80 hover:text-[#f6b846] py-2"
            >
              Main
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="block w-full text-left text-white/80 hover:text-[#f6b846] py-2"
            >
              Fitur
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
