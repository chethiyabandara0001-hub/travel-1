/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
// Anime.js v3.2.2 is loaded via CDN script in index.html
declare const anime: any;
import {
  Search,
  ArrowRight,
  ArrowLeft,
  Compass,
  Sliders,
  X,
  Check,
  Sparkles,
  MousePointer2
} from 'lucide-react';

interface Sanctuary {
  id: string;
  step: string;
  coordsLat: string;
  coordsLon: string;
  title1: string;
  title2: string;
  title3: string;
  subtitle: string;
  name: string;
  region: string;
  elevation: string;
  image: string;
  tag: string;
  description: string;
  highlights: string[];
}

const SANCTUARIES: Sanctuary[] = [
  {
    id: 'sigiriya',
    step: '01/05',
    coordsLat: "07°57' N",
    coordsLon: "80°45' E",
    title1: 'Ceylon.',
    title2: 'The Resonant',
    title3: 'Island.',
    subtitle: 'Curated journeys through heritage, wild jungles, and golden tides.',
    name: 'Sigiriya Sky Citadel',
    region: 'Central Province',
    elevation: '370m',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2000&q=85',
    tag: 'stagger opacity',
    description: 'A monolithic 5th-century palace engineered by King Kashyapa 200 meters above dense tropical canopy, celebrated for symmetrical water gardens and ancient frescoes.',
    highlights: ['Lion Gate Citadel', 'Symmetrical Mirror Basins', 'Celestial Cloud Frescoes', 'Summit Palace Terraces']
  },
  {
    id: 'ella',
    step: '02/05',
    coordsLat: "06°52' N",
    coordsLon: "81°03' E",
    title1: 'Highlands.',
    title2: 'Misty Tea',
    title3: 'Valleys.',
    subtitle: 'Wandering emerald cloud forests, cascading waterfalls, and colonial viaducts.',
    name: 'Ella Cloud Highlands',
    region: 'Central Highlands',
    elevation: '1,041m',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2000&q=85',
    tag: 'elastic.easeOut',
    description: 'Enveloped in emerald mountain mist, home to the colonial Nine Arches Viaduct, roaring Ravana gorge, and high-elevation artisan Orange Pekoe tea estates.',
    highlights: ['Nine Arches Bridge', 'Little Adam’s Peak', 'Ravana Falls Gorge', 'Hand-picked Orange Pekoe']
  },
  {
    id: 'yala',
    step: '03/05',
    coordsLat: "06°22' N",
    coordsLon: "81°31' E",
    title1: 'Wild Apex.',
    title2: 'Roaring Scrub',
    title3: 'Savannas.',
    subtitle: 'Tracking wild Asian elephants, coastal lagoons, and the highest leopard density.',
    name: 'Yala Wildlife Reserve',
    region: 'Southern Scrubland',
    elevation: '32m',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=2000&q=85',
    tag: 'shape morphing',
    description: 'Vast coastal thorn scrub and lagoons sustaining roaming herds of wild elephants, sloth bears, and the world’s densest wild leopard habitat.',
    highlights: ['Leopard Stalking Dunes', 'Elephant Bathing Lagoons', 'Menik River Banks', 'Crested Serpent Eagles']
  },
  {
    id: 'arugambay',
    step: '04/05',
    coordsLat: "06°50' N",
    coordsLon: "81°49' E",
    title1: 'Ocean Swell.',
    title2: 'Golden Point',
    title3: 'Breaks.',
    subtitle: 'Warm Indian Ocean barrels peeling across pristine sands and bohemian coastline.',
    name: 'Arugam Bay Surf Line',
    region: 'Eastern Shore',
    elevation: '4m',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=2000&q=85',
    tag: 'hover-path',
    description: 'Legendary peeling right-hand point breaks, untouched sand dunes, and relaxed coastal luxury bathed in equatorial trade winds.',
    highlights: ['Main Point Right Barrel', 'Whiskey Point Sunsets', 'Kottukal Lagoon Safari', 'Fresh Coastal Crab Curry']
  },
  {
    id: 'galle',
    step: '05/05',
    coordsLat: "06°01' N",
    coordsLon: "80°13' E",
    title1: 'Ramparts.',
    title2: 'Living Coral',
    title3: 'Bastions.',
    subtitle: 'Seventeenth-century Dutch granite bastions meeting azure oceanic migration corridors.',
    name: 'Galle Maritime Fort',
    region: 'Southern Coast',
    elevation: '12m',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=2000&q=85',
    tag: 'parallax layering',
    description: 'Living coral and granite ramparts of Galle Fort meeting migrating blue whales and spinner dolphins off the crystalline southern continental shelf.',
    highlights: ['Old Dutch Lighthouse', 'Coral Stone Ramparts', 'Deep Sea Cetacean Trek', 'Artisanal Cinnamon Mills']
  }
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = SANCTUARIES[currentIndex];

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dynamicFormOpen, setDynamicFormOpen] = useState(false);
  const [nightsSlider, setNightsSlider] = useState(7);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Animation Refs
  const organicMaskRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const topTrajectoryPathRef = useRef<SVGPathElement>(null);
  const rockTrajectoryPathRef = useRef<SVGPathElement>(null);
  const topFollowerRef = useRef<SVGGElement>(null);
  const rockFollowerRef = useRef<SVGGElement>(null);
  const customCursorDotRef = useRef<HTMLDivElement>(null);
  const customCursorRingRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Audio Synthesizer: 432Hz Resonant Drone & Ambient Waves
  const toggleAudio = () => {
    if (!isAudioPlaying) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(216, ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(432, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start();
        osc2.start();

        setIsAudioPlaying(true);
      } catch (e) {
        console.warn('Audio synthesis fallback', e);
        setIsAudioPlaying(true);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setIsAudioPlaying(false);
    }
  };

  // Dual-Ring Custom Trailing Cursor with Anime.js inertia
  useEffect(() => {
    const dot = customCursorDotRef.current;
    const ring = customCursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isMoving = true;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const renderCursor = () => {
      if (!ring) return;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      if (isMoving) requestAnimationFrame(renderCursor);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(renderCursor);

    const hoverables = document.querySelectorAll('button, a, input, [data-interactive="true"]');
    const handleMouseEnter = () => ring.classList.add('active');
    const handleMouseLeave = () => ring.classList.remove('active');

    hoverables.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      isMoving = false;
      window.removeEventListener('mousemove', onMouseMove);
      hoverables.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [currentIndex, dynamicFormOpen]);

  // Master Orchestration: 20+ Anime.js Animations
  const runMasterAnimations = () => {
    if (typeof anime === 'undefined') return;

    // 1. Entrance Stagger
    anime({
      targets: '.anime-nav-entry',
      opacity: [0, 1],
      translateY: [-16, 0],
      delay: anime.stagger(90, { start: 100 }),
      easing: 'easeOutCubic',
      duration: 800
    });

    // 2. Split-Text Reveal for "Ceylon. The Resonant Island."
    anime({
      targets: '.anime-char',
      opacity: [0, 1],
      translateY: [40, 0],
      skewY: [5, 0],
      delay: anime.stagger(30, { start: 150 }),
      easing: 'easeOutExpo',
      duration: 1000
    });

    // 3. Subtitle Word Stagger
    anime({
      targets: '.anime-sub-word',
      opacity: [0, 1],
      translateY: [14, 0],
      delay: anime.stagger(40, { start: 600 }),
      easing: 'easeOutQuart',
      duration: 700
    });

    // 4. Dynamic SVG Path Draw for trajectories
    if (topTrajectoryPathRef.current) {
      anime({
        targets: topTrajectoryPathRef.current,
        strokeDashoffset: [anime.setDashoffset(topTrajectoryPathRef.current), 0],
        easing: 'easeInOutSine',
        duration: 2400,
        delay: 300
      });
    }

    if (rockTrajectoryPathRef.current) {
      anime({
        targets: rockTrajectoryPathRef.current,
        strokeDashoffset: [anime.setDashoffset(rockTrajectoryPathRef.current), 0],
        easing: 'easeInOutSine',
        duration: 2600,
        delay: 500
      });
    }

    // 5. Path Follower along upper trajectory
    if (topTrajectoryPathRef.current && topFollowerRef.current) {
      const pathTop = anime.path(topTrajectoryPathRef.current);
      anime({
        targets: topFollowerRef.current,
        translateX: pathTop('x'),
        translateY: pathTop('y'),
        rotate: pathTop('angle'),
        easing: 'easeInOutQuad',
        duration: 5200,
        loop: true,
        delay: 400
      });
    }

    // Secondary Path Follower to Sigiriya rock
    if (rockTrajectoryPathRef.current && rockFollowerRef.current) {
      const pathRock = anime.path(rockTrajectoryPathRef.current);
      anime({
        targets: rockFollowerRef.current,
        translateX: pathRock('x'),
        translateY: pathRock('y'),
        rotate: pathRock('angle'),
        easing: 'easeInOutSine',
        duration: 6000,
        loop: true,
        delay: 700
      });
    }

    // 6. Organic Mask Morph: Sigiriya rock cutout morphing shape continuously
    if (organicMaskRef.current) {
      anime({
        targets: organicMaskRef.current,
        borderRadius: [
          '48% 52% 58% 42% / 46% 48% 52% 54%',
          '56% 44% 48% 52% / 54% 60% 40% 46%',
          '44% 56% 54% 46% / 42% 46% 54% 58%',
          '48% 52% 58% 42% / 46% 48% 52% 54%'
        ],
        easing: 'easeInOutSine',
        duration: 16000,
        loop: true,
        direction: 'alternate'
      });
    }

    // 20. Ambient Atmosphere Breathing (radial volcanic glow)
    anime({
      targets: '.anime-radial-glow',
      scale: [1, 1.2],
      opacity: [0.3, 0.6],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: 7000
    });

    // 22. Audio Waveform Equalizer
    anime({
      targets: '.anime-bar',
      height: ['3px', '18px'],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuad',
      duration: () => anime.random(350, 800),
      delay: anime.stagger(90)
    });

    // Glowing Star/Orb Breathing
    anime({
      targets: '.anime-glow-star',
      scale: [1, 1.35],
      opacity: [0.7, 1],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: () => anime.random(2000, 3500),
      delay: anime.stagger(300)
    });
  };

  useEffect(() => {
    runMasterAnimations();
  }, [currentIndex]);

  // 7. Mouse Parallax Layering: Rock visual & star dust shift on mouse move
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (heroImageRef.current && typeof anime !== 'undefined') {
      anime({
        targets: heroImageRef.current,
        translateX: x * 34,
        translateY: y * 34,
        scale: 1.05,
        easing: 'easeOutQuad',
        duration: 400
      });
    }

    if (typeof anime !== 'undefined') {
      anime({
        targets: '.anime-star-layer',
        translateX: -x * 45,
        translateY: -y * 45,
        easing: 'easeOutQuad',
        duration: 600
      });
    }
  };

  const handleCanvasMouseLeave = () => {
    if (heroImageRef.current && typeof anime !== 'undefined') {
      anime({
        targets: heroImageRef.current,
        translateX: 0,
        translateY: 0,
        scale: 1,
        easing: 'easeOutCubic',
        duration: 800
      });
    }
    if (typeof anime !== 'undefined') {
      anime({
        targets: '.anime-star-layer',
        translateX: 0,
        translateY: 0,
        easing: 'easeOutCubic',
        duration: 800
      });
    }
  };

  // 17. Magnetic Button Snap
  const handleMagneticMove = (e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - btnCenterX) * 0.4;
    const deltaY = (e.clientY - btnCenterY) * 0.4;

    if (typeof anime !== 'undefined') {
      anime({
        targets: btn,
        translateX: deltaX,
        translateY: deltaY,
        easing: 'easeOutQuad',
        duration: 250
      });
    }
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    if (typeof anime !== 'undefined') {
      anime({
        targets: btn,
        translateX: 0,
        translateY: 0,
        easing: 'easeOutElastic(1, 0.6)',
        duration: 700
      });
    }
  };

  // Navigation Prev/Next
  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % SANCTUARIES.length;
    transitionTo(nextIdx, 1);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + SANCTUARIES.length) % SANCTUARIES.length;
    transitionTo(prevIdx, -1);
  };

  const transitionTo = (index: number, dir: number) => {
    if (typeof anime !== 'undefined') {
      anime({
        targets: heroImageRef.current,
        opacity: [0.4, 1],
        scale: [1.1, 1],
        translateX: [dir * 30, 0],
        easing: 'easeOutQuart',
        duration: 800
      });

      anime({
        targets: '.anime-progress-line-fill',
        width: `${((index + 1) / SANCTUARIES.length) * 100}%`,
        easing: 'easeOutElastic(1, 0.7)',
        duration: 750
      });
    }
    setCurrentIndex(index);
  };

  // Search input interaction
  const handleSearchFocus = () => {
    setSearchFocused(true);
    setDynamicFormOpen(true);
    if (typeof anime !== 'undefined') {
      anime({
        targets: '#search-capsule-wrapper',
        scale: 1.04,
        boxShadow: '0 0 35px rgba(217, 119, 70, 0.45)',
        easing: 'easeOutBack',
        duration: 450
      });
    }
  };

  return (
    <div
      onMouseMove={handleCanvasMouseMove}
      onMouseLeave={handleCanvasMouseLeave}
      className="relative w-screen h-screen min-h-[700px] overflow-hidden bg-[#121417] text-[#e2ded7] select-none font-tech"
    >
      {/* 18. Custom Dual-Ring Trailing Cursor */}
      <div ref={customCursorDotRef} className="custom-cursor-dot hidden md:block" />
      <div ref={customCursorRingRef} className="custom-cursor-ring hidden md:block" />

      {/* 20. Ambient Atmosphere Breathing (Soft volcanic obsidian background) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="anime-radial-glow absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-br from-[#d97746]/10 via-[#181a1f]/50 to-transparent rounded-full blur-[140px]" />
        <div className="anime-radial-glow absolute -bottom-40 right-1/4 w-[850px] h-[850px] bg-gradient-to-tl from-[#e2ded7]/8 via-[#d97746]/8 to-transparent rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-noise opacity-35" />
      </div>

      {/* ========================================================= */}
      {/* TOP HEADER: EXACT BRAND + TRANSLUCENT NAVIGATION PILL */}
      {/* ========================================================= */}
      <header className="relative z-40 w-full px-8 sm:px-16 pt-8 sm:pt-10 flex items-center justify-between">
        
        {/* Left: "Ceylono" Brand Logo in elegant serif */}
        <div className="anime-nav-entry">
          <span className="font-cinzel text-3xl sm:text-4xl font-normal tracking-wide text-white cursor-pointer hover:text-[#d97746] transition-colors">
            Ceylono
          </span>
        </div>

        {/* Center-Right: Translucent Acrylic Coordinate & Audio Capsule Pill */}
        <div className="anime-nav-entry flex items-center rounded-full bg-[#1e2025]/80 border border-white/10 backdrop-blur-2xl px-5 py-2.5 shadow-2xl shadow-black/60 gap-5 sm:gap-7">
          
          {/* Audio Waveform Synthesizer Icon */}
          <button
            onClick={toggleAudio}
            title="Toggle Ceylon Resonant Audio Stream"
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-0.5 h-4">
              <span className={`anime-bar w-0.5 bg-white/70 rounded-full ${!isAudioPlaying ? 'h-1 opacity-40' : ''}`} />
              <span className={`anime-bar w-0.5 bg-white/70 rounded-full ${!isAudioPlaying ? 'h-2.5 opacity-40' : ''}`} />
              <span className={`anime-bar w-0.5 bg-white/70 rounded-full ${!isAudioPlaying ? 'h-4 opacity-40' : ''}`} />
              <span className={`anime-bar w-0.5 bg-white/70 rounded-full ${!isAudioPlaying ? 'h-2 opacity-40' : ''}`} />
              <span className={`anime-bar w-0.5 bg-white/70 rounded-full ${!isAudioPlaying ? 'h-1 opacity-40' : ''}`} />
            </div>
          </button>

          {/* Coordinates Readout matching screenshot: LAT 07°57' N // LON 80°45' E */}
          <div className="font-mono-coord text-xs sm:text-sm tracking-wider text-white/80 font-medium">
            LAT {current.coordsLat} // LON {current.coordsLon}
          </div>

          {/* Step Counter: 01/05 */}
          <div className="font-mono-coord text-xs sm:text-sm text-white/60 font-normal">
            {current.step}
          </div>

          {/* Far Right Oval Pill Button with Gold Border and Arrow */}
          <button
            onClick={() => setDetailModalOpen(true)}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            title="Explore Sanctuary"
            className="w-14 sm:w-16 h-7 rounded-full border border-amber-300/60 bg-amber-400/5 hover:bg-amber-400/20 flex items-center justify-center text-amber-200/90 transition-all shadow-[0_0_12px_rgba(251,191,36,0.15)] group"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN VIEWPORT: EDITORIAL HERO & EXACT ORGANIC SIGIRIYA ROCK */}
      {/* ========================================================= */}
      <div className="relative w-full h-[calc(100vh-100px)] px-8 sm:px-16 flex flex-col justify-between pt-6 sm:pt-10 pb-8 z-20">
        
        {/* Main Grid Stage */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
          
          {/* LEFT COLUMN: EDITORIAL TYPOGRAPHY & BEGIN JOURNEY */}
          <div className="lg:col-span-5 max-w-lg z-30 pt-2 sm:pt-6">
            
            {/* Top Coordinate Bracket Tag: _LAT 07°57' N] */}
            <div className="font-mono-coord text-[11px] sm:text-xs text-white/40 tracking-wider mb-5">
              _LAT {current.coordsLat}]
            </div>

            {/* Split-Text Reveal Header: Ceylon. The Resonant Island. */}
            <h1 className="font-cinzel text-5xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white leading-[1.06] mb-5">
              <span className="block overflow-hidden">
                {current.title1.split('').map((char, i) => (
                  <span key={i} className="anime-char inline-block text-white">
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
              <span className="block overflow-hidden">
                {current.title2.split('').map((char, i) => (
                  <span key={i} className="anime-char inline-block text-white">
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
              <span className="block overflow-hidden">
                {current.title3.split('').map((char, i) => (
                  <span key={i} className="anime-char inline-block text-white">
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed mb-7 max-w-sm">
              {current.subtitle.split(' ').map((word, i) => (
                <span key={i} className="anime-sub-word inline-block mr-1.5">
                  {word}
                </span>
              ))}
            </p>

            {/* Pill Button: "Begin Journey" + Cursor with "Move-interaction states" */}
            <div className="flex flex-col items-start gap-2">
              <button
                id="begin-journey-btn"
                onClick={() => setDetailModalOpen(true)}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                className="px-8 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-amber-300/40 hover:border-amber-300/80 text-sm sm:text-base text-white font-medium flex items-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.12)] transition-all"
              >
                <span>Begin Journey</span>
              </button>

              {/* Hand pointer icon with "Move-interaction states" caption */}
              <div className="flex items-center gap-1.5 pl-2 text-[11px] text-white/45 font-mono-coord mt-0.5">
                <MousePointer2 className="w-3.5 h-3.5 text-white/50" />
                <span>Move-interaction states</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN & CENTER CANVAS: TRAJECTORIES & ORGANIC SIGIRIYA MASK */}
          <div className="lg:col-span-7 relative h-full w-full flex items-center justify-end">
            
            {/* Soft Ambient Underglow beneath the organic crescent */}
            <div className="absolute top-1/2 -translate-y-1/2 right-12 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/15 via-[#cad5c7]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

            {/* Background Pale Organic Crescent Accent (Seafoam/Sage Tint from Screenshot) */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -right-8 w-[620px] sm:w-[700px] h-[620px] sm:h-[700px] pointer-events-none opacity-40 transition-all duration-700"
              style={{
                borderRadius: '50% 50% 48% 52% / 48% 54% 46% 52%',
                border: '1.5px solid rgba(202, 213, 199, 0.45)',
                background: 'radial-gradient(circle at 60% 40%, rgba(202, 213, 199, 0.18) 0%, transparent 70%)'
              }}
            />

            {/* Floating Star Particles / Radiant Orbs with Halos matching screenshot */}
            <div className="anime-star-layer absolute inset-0 pointer-events-none z-10">
              {/* Central star cluster near upper trajectory */}
              <div className="anime-glow-star absolute top-[16%] left-[30%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white] opacity-80" />
              <div className="anime-glow-star absolute top-[22%] left-[36%] w-1 h-1 bg-white rounded-full shadow-[0_0_6px_white] opacity-60" />
              <div className="anime-glow-star absolute top-[28%] left-[42%] w-2 h-2 bg-white rounded-full shadow-[0_0_12px_white] opacity-90" />
              <div className="anime-glow-star absolute top-[34%] left-[40%] w-1 h-1 bg-white rounded-full opacity-50" />
              
              {/* Waypoint star orb at the end of top trajectory */}
              <div className="anime-glow-star absolute top-[33%] left-[45%] w-3 h-3 bg-white rounded-full shadow-[0_0_16px_white,0_0_24px_rgba(255,255,255,0.8)] opacity-95" />

              {/* Waypoint node right before the rock */}
              <div className="anime-glow-star absolute top-[52%] left-[5%] w-2.5 h-2.5 bg-amber-100 rounded-full shadow-[0_0_14px_#fbbf24] opacity-90" />

              {/* Lower floating orb */}
              <div className="anime-glow-star absolute bottom-[30%] left-[58%] w-4 h-4 bg-white/70 rounded-full blur-[1px] shadow-[0_0_18px_rgba(255,255,255,0.6)] opacity-70" />
              <div className="anime-glow-star absolute bottom-[22%] left-[64%] w-2 h-2 bg-white/80 rounded-full shadow-[0_0_10px_white] opacity-75" />
            </div>

            {/* Trajectory Coordinate Tags */}
            <div className="absolute top-[39%] left-[31%] text-[10px] font-mono-coord text-white/35 pointer-events-none z-20">
              LON 80°45' E
            </div>
            <div className="absolute bottom-6 left-[18%] text-[10px] font-mono-coord text-white/30 pointer-events-none z-20">
              [ 00 80°45' E
            </div>

            {/* SVG Trajectory Lines matching screenshot precisely */}
            <svg
              className="absolute inset-0 w-full h-full z-10 pointer-events-none"
              viewBox="0 0 850 650"
              fill="none"
            >
              <defs>
                {/* Arrowhead marker for trajectory */}
                <marker
                  id="arrow-top"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#e2ded7" fillOpacity="0.8" />
                </marker>
                <marker
                  id="arrow-rock"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#e2ded7" fillOpacity="0.9" />
                </marker>
                <marker
                  id="arrow-bottom-left"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 2 L 6 5 L 0 8 z" fill="#e2ded7" fillOpacity="0.6" />
                </marker>
              </defs>

              {/* 1. Upper Curved Trajectory: From Begin Journey sweeping up to waypoint star */}
              <path
                ref={topTrajectoryPathRef}
                d="M 50 370 C 130 380, 200 320, 260 260 C 310 215, 360 205, 420 200"
                stroke="#e2ded7"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                strokeOpacity="0.45"
                markerEnd="url(#arrow-top)"
              />

              {/* 2. Primary Swooping Arc to Sigiriya Rock: Curves in and points directly to the rock */}
              <path
                ref={rockTrajectoryPathRef}
                d="M 400 420 C 470 450, 520 480, 580 430 C 630 390, 640 340, 680 320"
                stroke="#e2ded7"
                strokeWidth="1.4"
                strokeOpacity="0.55"
                markerEnd="url(#arrow-rock)"
              />

              {/* 3. Bottom-Left Trajectories near [parallax layering] */}
              <path
                d="M 90 510 C 80 470, 75 440, 85 410"
                stroke="#e2ded7"
                strokeWidth="1"
                strokeDasharray="3 3"
                strokeOpacity="0.4"
                markerEnd="url(#arrow-bottom-left)"
              />
              <path
                d="M 120 510 C 170 500, 200 460, 240 400"
                stroke="#e2ded7"
                strokeWidth="1"
                strokeDasharray="3 3"
                strokeOpacity="0.35"
                markerEnd="url(#arrow-bottom-left)"
              />

              {/* Animated Trajectory Follower Orb along upper trajectory */}
              <g ref={topFollowerRef}>
                <circle r="4" fill="#ffffff" filter="drop-shadow(0 0 8px #ffffff)" />
                <circle r="8" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
              </g>

              {/* Animated Trajectory Follower Orb along rock trajectory */}
              <g ref={rockFollowerRef}>
                <circle r="3.5" fill="#fcd34d" filter="drop-shadow(0 0 8px #fcd34d)" />
              </g>
            </svg>

            {/* THE GIANT ORGANIC CRESCENT MASK: SIGIRIYA ROCK FORTRESS */}
            <div
              ref={organicMaskRef}
              className="relative w-[480px] sm:w-[580px] md:w-[650px] lg:w-[720px] h-[480px] sm:h-[580px] md:h-[650px] lg:h-[720px] overflow-hidden shadow-2xl border-2 border-white/10 z-10"
              style={{
                borderRadius: '48% 52% 58% 42% / 46% 48% 52% 54%',
                boxShadow: '0 0 90px rgba(0,0,0,0.9), inset 0 0 60px rgba(0,0,0,0.6)'
              }}
            >
              <img
                ref={heroImageRef}
                src={current.image}
                alt={current.name}
                className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.08] transition-all duration-700"
              />
              {/* Edge vignetting to blend organically into obsidian backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121417]/80 via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121417]/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* FLOATING SEARCH CAPSULE: "Whither your heart?" + "Dynamic form Inputs..." */}
            <div className="absolute top-[48%] left-[2%] sm:left-[6%] z-30 w-64 sm:w-72">
              <div
                id="search-capsule-wrapper"
                className="relative rounded-full bg-[#ece8df] text-[#1c1d21] p-1.5 flex items-center justify-between shadow-2xl transition-all duration-300"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  placeholder="Whither your heart?"
                  className="bg-transparent pl-4 pr-2 text-xs sm:text-sm text-[#1c1d21] placeholder-[#1c1d21]/60 font-medium focus:outline-none w-full"
                />
                <button
                  onClick={() => setDynamicFormOpen(!dynamicFormOpen)}
                  className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors shrink-0 text-[#1c1d21]"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Lower Attached Capsule: "Dynamic form Inputs..." */}
              <div
                onClick={() => setDynamicFormOpen(!dynamicFormOpen)}
                className="mt-1.5 px-4 py-2 rounded-2xl bg-[#1c1e23]/95 border border-white/10 hover:border-white/25 cursor-pointer backdrop-blur-xl flex items-center justify-between text-xs text-white/75 shadow-xl transition-all"
              >
                <span>Dynamic form Inputs...</span>
                <Sliders className="w-3.5 h-3.5 text-white/50" />
              </div>

              {/* Dynamic Inputs Dropdown Selector */}
              {dynamicFormOpen && (
                <div className="absolute left-0 right-0 top-24 p-4 rounded-3xl bg-[#181a1f]/95 border border-white/15 backdrop-blur-2xl shadow-2xl z-40 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-mono-coord uppercase tracking-wider text-white/40 pb-1 border-b border-white/10">
                    <span>Expedition Configurator</span>
                    <button onClick={() => setDynamicFormOpen(false)} className="text-white/60 hover:text-white">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {SANCTUARIES.map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          transitionTo(idx, 1);
                          setDynamicFormOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between ${
                          currentIndex === idx ? 'bg-[#d97746] text-white' : 'bg-white/5 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <span>{s.name}</span>
                        <span className="font-mono-coord text-[10px] opacity-60">{s.coordsLat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM CONTROLS: EXACT "[parallax layering" + ARROW LINE & BUTTONS */}
        {/* ========================================================= */}
        <div className="relative z-30 pt-3 flex items-center justify-between">
          
          {/* Left Text: [parallax layering / powered by Anima.js */}
          <div className="flex flex-col">
            <span className="text-sm font-normal text-white/85 tracking-wide font-mono-coord">
              [parallax layering
            </span>
            <span className="text-xs text-white/45 font-mono-coord">
              powered by Anima.js
            </span>
          </div>

          {/* Long Connecting Trajectory Line with Arrow and Circular Buttons (←) (→) */}
          <div className="flex items-center gap-5 sm:gap-7">
            
            {/* Horizontal Line with Arrowhead */}
            <div className="w-48 sm:w-72 md:w-96 h-px bg-white/20 relative flex items-center">
              <div
                className="anime-progress-line-fill absolute left-0 top-0 h-full bg-white/70 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / SANCTUARIES.length) * 100}%` }}
              />
              <div className="absolute right-0 -top-1 w-2 h-2 border-t border-r border-white/50 rotate-45" />
            </div>

            {/* Circular Arrow Buttons matching screenshot */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrev}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                title="Previous Destination"
                className="w-8 h-8 rounded-full border border-white/20 hover:border-white/60 flex items-center justify-center text-white/70 hover:text-white transition-all text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                title="Next Destination"
                className="w-8 h-8 rounded-full border border-white/20 hover:border-white/60 flex items-center justify-center text-white/70 hover:text-white transition-all text-xs"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* SANCTUARY DOSSIER MODAL ("Begin Journey") */}
      {/* ========================================================= */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-[#16181d] border border-white/20 shadow-2xl">
            <button
              onClick={() => setDetailModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 w-full">
              <img src={current.image} alt={current.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16181d] via-[#16181d]/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-xs font-mono-coord uppercase tracking-wider bg-amber-500/20 text-amber-200 border border-amber-500/30 inline-block mb-2">
                  UNESCO Sanctuaries of Ceylon
                </span>
                <h3 className="font-cinzel text-3xl font-bold text-white">{current.name}</h3>
                <div className="text-xs text-white/70 font-mono-coord mt-1">
                  Coordinates: {current.coordsLat} // {current.coordsLon} | Elevation: {current.elevation}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <p className="text-sm text-white/80 leading-relaxed">{current.description}</p>

              <div>
                <h4 className="text-xs font-mono-coord uppercase tracking-wider text-amber-400/90 mb-3">
                  Resonant Sanctuary Highlights:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {current.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/85 bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-white/40 block font-mono-coord">Pacing</span>
                  <span className="text-sm font-semibold text-white">3 Nights Recommended</span>
                </div>
                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    setTimeout(() => {
                      setBookingConfirmed(false);
                      setDetailModalOpen(false);
                    }, 1800);
                  }}
                  className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-black font-medium text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
                >
                  {bookingConfirmed ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Sanctuary Reserved</span>
                    </>
                  ) : (
                    <>
                      <span>Lock Into Expedition</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
