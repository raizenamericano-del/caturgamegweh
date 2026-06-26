import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Monitor, Globe, Users, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onStartGame: () => void;
}

export default function HeroSection({ onStartGame }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    if (titleRef.current) {
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }

    if (subtitleRef.current) {
      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      );
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.children;
      tl.to(
        cards,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: 'power3.out',
        },
        '-=0.3'
      );
    }

    if (btnRef.current) {
      tl.to(
        btnRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.2'
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  const scrollToGame = () => {
    const gameSection = document.getElementById('game');
    if (gameSection) {
      gameSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const gameModes = [
    {
      icon: Monitor,
      title: 'Lawan Komputer',
      description: 'Latih strategi melawan AI dengan berbagai tingkat kesulitan',
    },
    {
      icon: Globe,
      title: 'Main Online',
      description: 'Tantang pemain dari seluruh dunia secara real-time',
    },
    {
      icon: Users,
      title: 'Berteman',
      description: 'Bermain bersama teman dengan kode undangan pribadi',
    },
  ];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 z-10"
    >
      {/* Hero background image overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: 'url(/assets/hero-bg.jpg)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/50 to-black" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Gold knight decoration */}
        <div className="mb-6 flex justify-center">
          <img
            src="/assets/knight-gold.png"
            alt="Gold Knight"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_0_20px_rgba(246,184,70,0.4)]"
          />
        </div>

        <h1
          ref={titleRef}
          className="opacity-0 translate-y-5 text-[clamp(2.5rem,6vw,4.5rem)] font-outfit font-medium text-[#f6b846] text-glow leading-tight"
        >
          RoyalKyy Chess
        </h1>

        <p
          ref={subtitleRef}
          className="opacity-0 translate-y-4 mt-4 text-[clamp(1.2rem,2.5vw,1.8rem)] text-white/80 font-outfit font-light"
        >
          Master the Art of War
        </p>

        {/* Game mode cards */}
        <div
          ref={cardsRef}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {gameModes.map((mode) => (
            <div
              key={mode.title}
              className="opacity-0 translate-y-5 group bg-[rgba(26,23,23,0.95)] border border-white/10 rounded-lg p-5 cursor-pointer transition-all duration-300 hover:border-[rgba(246,184,70,0.5)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(246,184,70,0.2)]"
              onClick={onStartGame}
            >
              <mode.icon className="w-8 h-8 text-[#f6b846] mb-3 mx-auto transition-transform duration-300 group-hover:scale-110" />
              <h3 className="text-white font-outfit font-medium text-base mb-1">
                {mode.title}
              </h3>
              <p className="text-white/60 text-sm font-outfit font-light leading-relaxed">
                {mode.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          ref={btnRef}
          onClick={scrollToGame}
          className="opacity-0 mt-8 inline-flex items-center gap-2 bg-[#f6b846] text-black font-outfit font-medium px-8 py-3 rounded hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
        >
          Mulai Permainan
        </button>

        {/* Scroll indicator */}
        <button
          onClick={scrollToGame}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-[#f6b846] transition-colors duration-200 animate-bounce"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}
