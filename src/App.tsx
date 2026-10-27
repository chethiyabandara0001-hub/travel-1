import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown,
  Compass, Copy, MapPin, Menu, Minus, Plus, X
} from 'lucide-react';
import './index.css';

type Destination = {
  id: string;
  name: string;
  region: string;
  eyebrow: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  summary: string;
  highlights: string[];
  nights: number;
};

const DESTINATIONS: Destination[] = [
  {
    id: 'sigiriya', name: 'Sigiriya', region: 'The Cultural Triangle', eyebrow: '01 / THE ANCIENT HEART',
    subtitle: 'Where history rises above the canopy.',
    image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=2200&q=85',
    imageAlt: 'An atmospheric landscape in Sri Lanka',
    summary: 'Rise before the sun to discover the ancient rock fortress, quiet village paths and the extraordinary art of a civilization that still shapes the island.',
    highlights: ['The ancient rock fortress', 'Village walks & local kitchens', 'Golden-hour landscapes'], nights: 3,
  },
  {
    id: 'ella', name: 'Ella', region: 'The Hill Country', eyebrow: '02 / ABOVE THE CLOUDS',
    subtitle: 'Slow mornings in the emerald highlands.',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2200&q=85',
    imageAlt: 'Green hills and mist in the highlands',
    summary: 'Follow winding mountain paths, meet tea growers and find the quiet between mist-covered peaks and railway journeys through the hills.',
    highlights: ['Tea country encounters', 'Mountain walks', 'The hill-country railway'], nights: 3,
  },
  {
    id: 'yala', name: 'Yala', region: 'The Wild South', eyebrow: '03 / INTO THE WILD',
    subtitle: 'An untamed rhythm, entirely its own.',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=2200&q=85',
    imageAlt: 'Wild elephants in their natural habitat',
    summary: 'Explore the changing textures of the dry-zone wilderness with thoughtful wildlife encounters and extraordinary coastal scenery.',
    highlights: ['Naturalist-led wildlife drives', 'Quiet coastal landscapes', 'Sunrise in the wilderness'], nights: 2,
  },
  {
    id: 'arugam', name: 'Arugam Bay', region: 'The East Coast', eyebrow: '04 / THE EASTERN TIDE',
    subtitle: 'Let the days move with the ocean.',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=2200&q=85',
    imageAlt: 'A surfer riding a wave in the ocean',
    summary: 'Long afternoons, salty air and a coastline that invites you to put the itinerary away for a while.',
    highlights: ['Surf & ocean mornings', 'Coastal village life', 'Laid-back sunset evenings'], nights: 4,
  },
  {
    id: 'galle', name: 'Galle', region: 'The Southern Coast', eyebrow: '05 / SALT & STORIES',
    subtitle: 'An old-world city beside the sea.',
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=2200&q=85',
    imageAlt: 'A tropical coastal landscape',
    summary: 'Walk shaded streets within centuries-old fort walls, linger over good food and take in the Indian Ocean as the sun goes down.',
    highlights: ['Galle Fort architecture', 'Independent artisan studios', 'Oceanfront sundowners'], nights: 2,
  },
];

const EXPERIENCES = [
  {
    no: '01', title: 'The wild side', subtitle: 'Where the island is still untamed',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Elephants wandering in the wild', tag: 'WILDLIFE', destinationId: 'yala',
  },
  {
    no: '02', title: 'In the highlands', subtitle: 'Tea, mist and slower mornings',
    image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Misty Sri Lankan hills', tag: 'NATURE', destinationId: 'ella',
  },
  {
    no: '03', title: 'An ocean state of mind', subtitle: 'The coast, on its own terms',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=85',
    imageAlt: 'Surfing on ocean waves', tag: 'COAST', destinationId: 'arugam',
  },
];

const PACES = ['Unhurried', 'Adventure', 'Culture', 'A little of everything'] as const;
type Pace = typeof PACES[number];

function Wordmark({ light = false }: { light?: boolean }) {
  return <span className={`wordmark ${light ? 'wordmark--light' : ''}`}>ceylono<span className="wordmark-dot">.</span></span>;
}

function SectionMarker({ children, inverted = false }: { children: React.ReactNode; inverted?: boolean }) {
  return <div className={`section-marker ${inverted ? 'section-marker--inverted' : ''}`}><span className="marker-dash" />{children}</div>;
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function App() {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(0);
  const [guestCount, setGuestCount] = useState(2);
  const [days, setDays] = useState(8);
  const [pace, setPace] = useState<Pace>('Unhurried');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [month, setMonth] = useState('Flexible dates');

  const featured = DESTINATIONS[active];
  const selectedDestination = DESTINATIONS[selected];
  const detail = DESTINATIONS.find(d => d.id === detailId);
  const travelBrief = useMemo(() => [
    'CEYLONO / YOUR TRAVEL BRIEF',
    `Destination: ${selectedDestination.name}, ${selectedDestination.region}`,
    `Length of stay: ${days} days`,
    `Travellers: ${guestCount}`,
    `Travel style: ${pace}`,
    `Dates: ${month}`,
    'I would like to explore a personally curated journey in Sri Lanka.'
  ].join('\n'), [selectedDestination, days, guestCount, pace, month]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 42);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setDetailId(null); setMenuOpen(false); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = detailId || menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [detailId, menuOpen]);

  const reveal = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.16 },
    transition: { duration: prefersReducedMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(travelBrief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copy your travel brief:', travelBrief);
    }
  };

  const navigate = (id: string) => { setMenuOpen(false); scrollToSection(id); };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <button className="brand-button" onClick={() => navigate('home')} aria-label="Ceylono home"><Wordmark light /></button>
        <nav className="desktop-nav" aria-label="Main navigation">
          <button onClick={() => navigate('story')}>Our philosophy</button>
          <button onClick={() => navigate('places')}>The places</button>
          <button onClick={() => navigate('experiences')}>Experiences</button>
        </nav>
        <button className="header-cta" onClick={() => navigate('enquire')}>
          Plan a journey <ArrowUpRight size={15} strokeWidth={1.6} />
        </button>
        <button className="mobile-menu-toggle" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && <motion.div className="mobile-menu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <Wordmark light />
          <button onClick={() => navigate('story')}>Our philosophy</button>
          <button onClick={() => navigate('places')}>The places</button>
          <button onClick={() => navigate('experiences')}>Experiences</button>
          <button onClick={() => navigate('enquire')}>Plan a journey <ArrowUpRight size={18}/></button>
        </motion.div>}
      </AnimatePresence>

      <main id="main">
        <section className="hero" id="home" aria-label="Discover Sri Lanka">
          <AnimatePresence mode="sync">
            <motion.div className="hero-photo" key={featured.id}
              initial={{opacity:0, scale:1.045}} animate={{opacity:1, scale:1}}
              exit={{opacity:0}} transition={{duration: prefersReducedMotion ? 0 : 1.1, ease:'easeOut'}}>
              <img src={featured.image} alt={featured.imageAlt} fetchPriority="high" />
            </motion.div>
          </AnimatePresence>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-frame" aria-hidden="true"><span>EST. ON AN ISLAND OF STORIES</span><span>SRI LANKA · 07° N / 81° E</span></div>
          <div className="hero-content content-width">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.85,delay:.12}}>
              <SectionMarker inverted>NOT JUST ANOTHER DESTINATION</SectionMarker>
              <h1>An island<br />to <em>feel.</em><br />Not just see.</h1>
              <div className="hero-bottomline">
                <p>Unhurried, thoughtfully crafted journeys through the many sides of Sri Lanka.</p>
                <button className="round-link round-link--cream" onClick={() => navigate('story')} aria-label="Discover our approach"><ArrowDown size={19} strokeWidth={1.6}/></button>
              </div>
            </motion.div>
          </div>
          <div className="hero-bottom content-width">
            <div className="hero-place-label">
              <div><MapPin size={17} strokeWidth={1.5} /><span>{featured.name} <small>/ {featured.region}</small></span></div>
            </div>
            <div className="hero-switcher" aria-label="Explore featured destinations">
              <button onClick={() => setActive(i => (i - 1 + DESTINATIONS.length) % DESTINATIONS.length)} aria-label="Previous destination"><ArrowLeft size={17}/></button>
              <span><strong>{String(active+1).padStart(2,'0')}</strong> <span className="hero-switcher-line" /> {String(DESTINATIONS.length).padStart(2,'0')}</span>
              <button onClick={() => setActive(i => (i + 1) % DESTINATIONS.length)} aria-label="Next destination"><ArrowRight size={17}/></button>
            </div>
          </div>
        </section>

        <section className="intro-section" id="story">
          <div className="content-width intro-grid">
            <motion.div {...reveal}>
              <SectionMarker>THIS IS CEYLONO</SectionMarker>
              <h2 className="display-heading">There is more to this island than meets the <em>eye.</em></h2>
            </motion.div>
            <motion.div className="intro-copy" {...reveal}>
              <span className="intro-number">01 — 04</span>
              <p className="intro-lead">Some places stay with you long after you've left.</p>
              <p>We believe travel should be more than a checklist. The best journeys leave room for wandering, listening, meeting people, and discovering something unexpected along the way.</p>
              <button className="text-link" onClick={() => navigate('places')}>Discover our places <ArrowUpRight size={17}/></button>
            </motion.div>
          </div>
          <div className="marquee-words" aria-hidden="true"><span>WONDER &nbsp; • &nbsp; CONNECTION &nbsp; • &nbsp; DISCOVERY &nbsp; • &nbsp; SLOW TRAVEL &nbsp; • &nbsp; WONDER &nbsp; • &nbsp; CONNECTION</span></div>
        </section>

        <section className="places-section" id="places">
          <div className="content-width">
            <div className="places-top">
              <motion.div {...reveal}>
                <SectionMarker>THE PLACES</SectionMarker>
                <h2 className="display-heading">Five places.<br /><em>Infinite</em> stories.</h2>
              </motion.div>
              <motion.p {...reveal}>From ancient cities to wide-open coastlines, follow the feeling that draws you in.</motion.p>
            </div>
            <div className="places-layout">
              <div className="places-list" role="list" aria-label="Sri Lanka destinations">
                {DESTINATIONS.map((place, idx) => (
                  <button key={place.id} className={`place-row ${selected === idx ? 'is-active' : ''}`} onClick={() => setSelected(idx)} aria-pressed={selected === idx}>
                    <span className="place-index">{String(idx+1).padStart(2,'0')}</span>
                    <span className="place-text"><strong>{place.name}</strong><small>{place.region}</small></span>
                    <ArrowUpRight size={21} strokeWidth={1.4}/>
                  </button>
                ))}
              </div>
              <div className="places-feature">
                <AnimatePresence mode="wait">
                  <motion.div className="places-feature-photo" key={selectedDestination.id} initial={{opacity:0,scale:1.025}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:prefersReducedMotion?0:.5}}>
                    <img src={selectedDestination.image} loading="lazy" alt={selectedDestination.imageAlt} />
                  </motion.div>
                </AnimatePresence>
                <div className="places-feature-meta"><span>{selectedDestination.eyebrow}</span><span>SRI LANKA</span></div>
                <div className="places-feature-foot"><p>{selectedDestination.subtitle}</p><button onClick={() => setDetailId(selectedDestination.id)} className="circle-ink" aria-label={`Read about ${selectedDestination.name}`}><ArrowUpRight size={20}/></button></div>
              </div>
            </div>
          </div>
        </section>

        <section className="interlude-section" aria-label="Our travel philosophy">
          <div className="interlude-image"><img src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2200&q=85" loading="lazy" alt="The green highlands of Sri Lanka" /></div>
          <div className="interlude-shade" />
          <motion.div className="interlude-content content-width" {...reveal}>
            <span className="micro-label">A DIFFERENT PACE OF TRAVEL</span>
            <p>Leave space for<br /><em>the unexpected.</em></p>
            <span className="interlude-rule" />
          </motion.div>
        </section>

        <section className="experience-section" id="experiences">
          <div className="content-width">
            <motion.div className="experience-head" {...reveal}>
              <div><SectionMarker>WAY BEYOND THE ORDINARY</SectionMarker><h2 className="display-heading">Made of <em>moments.</em></h2></div>
              <p>It is the little things — a quiet sunrise, a story shared, an unplanned turn — that make a journey yours.</p>
            </motion.div>
            <div className="experience-grid">
              {EXPERIENCES.map((item, idx) => (
                <motion.button {...reveal} className={`experience-card experience-card--${idx+1}`} key={item.no} onClick={() => setDetailId(item.destinationId)} aria-label={`Discover ${item.title}`}>
                  <span className="experience-image"><img src={item.image} loading="lazy" alt={item.imageAlt}/><span className="experience-image-shade" /></span>
                  <span className="experience-tag">{item.no} / {item.tag}</span>
                  <span className="experience-card-bottom"><span><strong>{item.title}</strong><small>{item.subtitle}</small></span><span className="experience-arrow"><ArrowUpRight size={19}/></span></span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <section className="enquiry-section" id="enquire">
          <div className="content-width enquiry-grid">
            <motion.div className="enquiry-intro" {...reveal}>
              <SectionMarker>YOUR JOURNEY STARTS HERE</SectionMarker>
              <h2 className="display-heading">Every great story begins with <em>a little curiosity.</em></h2>
              <p>Start with a few details. Shape a travel brief you can share with a local travel specialist when you're ready.</p>
              <div className="enquiry-side-note"><Compass size={26} strokeWidth={1.1}/><span>Made for journeys that feel personal, never prescribed.</span></div>
            </motion.div>
            <motion.div className="brief-card" {...reveal}>
              <div className="brief-header"><div><span className="micro-label">CEYLONO / JOURNEY NOTES</span><h3>Make it yours.</h3></div><span className="brief-number">01 / 01</span></div>
              <div className="brief-field"><label htmlFor="journey-destination">Where would you like to go?</label><div className="select-wrap"><select id="journey-destination" value={selected} onChange={e => setSelected(Number(e.target.value))}>{DESTINATIONS.map((dest,i)=><option key={dest.id} value={i}>{dest.name} — {dest.region}</option>)}</select><ChevronDown size={19}/></div></div>
              <div className="brief-row">
                <div className="brief-field"><label htmlFor="journey-month">When?</label><div className="select-wrap"><select id="journey-month" value={month} onChange={e => setMonth(e.target.value)}>{['Flexible dates','January – March','April – June','July – September','October – December'].map(m=><option key={m}>{m}</option>)}</select><ChevronDown size={18}/></div></div>
                <div className="brief-field"><label>Travellers</label><div className="number-control"><button onClick={() => setGuestCount(v=>Math.max(1,v-1))} aria-label="Remove a traveller"><Minus size={16}/></button><span>{guestCount}</span><button onClick={() => setGuestCount(v=>Math.min(12,v+1))} aria-label="Add a traveller"><Plus size={16}/></button></div></div>
              </div>
              <div className="brief-field"><div className="slider-title"><label htmlFor="journey-days">How long?</label><span>{days} DAYS</span></div><input type="range" id="journey-days" min="3" max="21" value={days} onChange={e=>setDays(Number(e.target.value))}/><div className="range-labels"><span>3 DAYS</span><span>21 DAYS</span></div></div>
              <div className="brief-field"><label>What feels like your kind of journey?</label><div className="pace-grid">{PACES.map(p=><button key={p} className={pace===p?'is-picked':''} onClick={()=>setPace(p)} aria-pressed={pace===p}>{p}</button>)}</div></div>
              <button className="brief-submit" onClick={copyBrief}>{copied ? <><Check size={17}/> Copied to clipboard</> : <><Copy size={16}/> Copy my travel brief <ArrowUpRight size={17}/></>}</button>
              <p className="brief-disclaimer">This creates a travel brief to share. It does not submit a booking or collect your personal details.</p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-width">
          <div className="footer-top"><div><Wordmark light/><p>A more personal way to discover Sri Lanka.</p></div><button onClick={()=>navigate('home')} className="back-to-top">BACK TO TOP <ArrowUpRight size={16}/></button></div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} CEYLONO. THE RESONANT ISLAND.</span><span>CRAFTED FOR CURIOUS TRAVELLERS.</span></div>
        </div>
      </footer>

      <AnimatePresence>
        {detail && <motion.div className="detail-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} role="presentation" onMouseDown={e=>{ if(e.target===e.currentTarget) setDetailId(null); }}>
          <motion.div role="dialog" aria-modal="true" aria-label={`Discover ${detail.name}`} className="detail-panel" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:18}} transition={{duration:.3}}>
            <button className="detail-close" onClick={()=>setDetailId(null)} aria-label="Close destination details"><X size={22}/></button>
            <img src={detail.image} alt={detail.imageAlt}/>
            <div className="detail-body"><SectionMarker>{detail.region.toUpperCase()}</SectionMarker><h2>{detail.name}<span>.</span></h2><p>{detail.summary}</p><div className="detail-highlights"><span className="micro-label">A FEW REASONS TO GO</span>{detail.highlights.map(h=><div key={h}><Check size={17}/>{h}</div>)}</div><button className="detail-action" onClick={()=>{setSelected(DESTINATIONS.findIndex(d=>d.id===detail.id));setDetailId(null);window.setTimeout(()=>navigate('enquire'),160);}}>Plan around {detail.name} <ArrowUpRight size={18}/></button></div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
