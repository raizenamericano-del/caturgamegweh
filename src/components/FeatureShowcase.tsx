import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Palette,
  Hexagon,
  BarChart3,
  History,
  Sliders,
  Eye,
  Trophy,
  BookOpen,
  Puzzle,
  Globe,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Palette,
    title: 'Tema Papan Variatif',
    description: 'Pilih dari 4 tema papan yang indah: Classic, Sage, Slate, dan Rose.',
  },
  {
    icon: Hexagon,
    title: 'Futuristic Piece Set',
    description: 'Bidak catur dengan desain futuristik bergaya gold dan silver.',
  },
  {
    icon: BarChart3,
    title: 'Analisis Gerakan',
    description: 'Evaluasi setiap gerakan dengan sistem analisis real-time.',
  },
  {
    icon: History,
    title: 'Riwayat Permainan',
    description: 'Lacak dan tinjau semua gerakan dalam format notasi standar.',
  },
  {
    icon: Sliders,
    title: 'Tingkat Kesulitan',
    description: '10 level AI dari Pemula hingga Legenda untuk setiap skill.',
  },
  {
    icon: Eye,
    title: 'Mode Penonton',
    description: 'Saksikan pertandingan pemain lain secara real-time.',
  },
  {
    icon: Trophy,
    title: 'Sistem Peringkat',
    description: 'Naik peringkat dengan sistem ELO dan kompetisi musiman.',
  },
  {
    icon: BookOpen,
    title: 'Pusat Belajar',
    description: 'Pelajaran interaktif, eksplorasi pembukaan, dan database GM.',
  },
  {
    icon: Puzzle,
    title: 'Pelatih Taktik',
    description: 'Ribuan puzzle taktik dengan tingkat kesulitan bertingkat.',
  },
  {
    icon: Globe,
    title: 'Komunitas Global',
    description: 'Bergabung dengan klub, guild, dan turnamen internasional.',
  },
];

export default function FeatureShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // Grid items animation
      if (gridRef.current) {
        const items = gridRef.current.children;
        gsap.fromTo(
          items,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-32 px-4 sm:px-6"
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-12">
          <img
            src="/assets/king-gold.png"
            alt="Gold King"
            className="w-12 h-12 mx-auto mb-4 opacity-60"
          />
          <h2
            ref={titleRef}
            className="text-[clamp(2rem,5vw,3.5rem)] font-outfit font-medium text-white leading-tight"
          >
            Fitur <span className="text-[#f6b846]">Premium</span>
          </h2>
          <p className="mt-4 text-white/60 font-outfit font-light max-w-xl mx-auto">
            Platform catur dengan fitur lengkap untuk pemula hingga grandmaster
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-5 bg-white/[0.03] border border-white/10 rounded-lg hover:border-[#f6b846]/30 hover:bg-white/[0.06] transition-all duration-300"
            >
              <feature.icon className="w-7 h-7 text-[#f6b846] mb-3 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="text-sm font-outfit font-medium text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-xs font-outfit font-light text-white/50 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
