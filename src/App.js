import React, { useEffect, useState } from "react";
import "./App.css";
import Avatar3D from "./Avatar3D";
import cameraFrame from "./camera-frame.png";
import WorkShowcase from "./WorkShowcase";
import AboutPlayground from "./AboutPlayground";
import { portfolioProfile } from "./portfolioProfile";
import "./SitePolish.css";

// Add your own photos by setting `src` (e.g. src: "/photos/clouds.jpg" or an imported file).
// Photos without a `src` fall back to the illustrated placeholders below.
const photos = [
  { title: "Above the clouds", category: "LANDSCAPES", tone: "photo-sky", src: null, alt: "" },
  { title: "A slower kind of blue", category: "UNDERWATER", tone: "photo-sea", src: null, alt: "" },
  { title: "Finding a foothold", category: "OUTDOORS", tone: "photo-rock", src: null, alt: "" },
  { title: "Light, in passing", category: "DETAILS", tone: "photo-light", src: null, alt: "" },
  { title: "Somewhere in bloom", category: "BOTANICAL", tone: "photo-flower", src: null, alt: "" },
];

function Flower({ className = "", petals = 8, size = 280, delay = 0 }) {
  const angles = Array.from({ length: petals }, (_, i) => (360 / petals) * i);
  return (
    <svg className={`flower ${className}`} style={{ "--size": `${size}px`, "--delay": `${delay}s` }} viewBox="0 0 300 300" aria-hidden="true">
      <g className="flower-petals">
        {angles.map((angle, i) => (
          <ellipse key={i} className="petal" cx="150" cy="89" rx="25" ry="70"
            transform={`rotate(${angle} 150 150)`} style={{ "--i": i, "--petals": petals }} />
        ))}
      </g>
      <circle cx="150" cy="150" r="29" fill="#c99b45" />
      <circle cx="150" cy="150" r="20" fill="#8f642c" opacity=".45" />
      {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={150 + Math.cos(i * 2.4) * (8 + (i % 4) * 3)} cy={150 + Math.sin(i * 2.4) * (8 + (i % 4) * 3)} r="2" fill="#f2d58a" opacity=".9" />)}
    </svg>
  );
}

function Bud({ className = "", size = 140 }) {
  return <svg className={`bud ${className}`} width={size} height={size * 1.55} viewBox="0 0 140 220" aria-hidden="true">
    <path d="M70 220 C69 172 72 128 72 81" stroke="#7e8661" strokeWidth="3" fill="none" />
    <path d="M70 175 C28 172 20 144 17 130 C48 131 66 148 70 175Z" fill="#9da47b" />
    <path d="M72 148 C107 144 119 120 121 104 C91 107 76 126 72 148Z" fill="#8d986f" />
    <g className="bud-head">
      <path d="M70 95 C34 81 33 43 51 24 C61 11 80 10 91 24 C111 47 103 81 70 95Z" fill="#cbb9d0" />
      <path d="M70 94 C53 67 59 32 71 17 C84 37 86 68 70 94Z" fill="#e7dce7" />
      <path d="M70 95 C41 82 28 58 41 39 C51 53 58 72 70 95Z" fill="#b5a0bf" />
      <path d="M70 95 C98 79 111 55 98 38 C90 56 79 77 70 95Z" fill="#d8c8dc" />
      <path d="M70 95 C50 74 43 50 53 28 C68 46 72 68 70 95Z" fill="#c8b3cf" />
    </g>
  </svg>;
}

function PlaceholderArt({ tone }) {
  return <>
    {tone === "photo-sky" && <><div className="sun-disc" /><div className="cloud cloud-one" /><div className="cloud cloud-two" /><div className="mountain mountain-one" /><div className="mountain mountain-two" /></>}
    {tone === "photo-sea" && <><div className="sea-light" /><div className="sea-ray ray-one" /><div className="sea-ray ray-two" /><div className="fish fish-one" /><div className="fish fish-two" /><div className="sea-floor" /></>}
    {tone === "photo-rock" && <><div className="rock rock-one" /><div className="rock rock-two" /><div className="rock rock-three" /><div className="tiny-climber" /></>}
    {tone === "photo-light" && <><div className="light-window" /><div className="light-shadow" /><div className="light-leaf" /></>}
    {tone === "photo-flower" && <><Flower size={190} petals={9} className="gallery-flower" /><div className="flower-shadow" /></>}
  </>;
}

function PhotoCarousel() {
  const n = photos.length;
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [flash, setFlash] = useState(0);
  const [touched, setTouched] = useState(false);
  const startX = React.useRef(null);

  const go = (dir) => { setIndex((i) => (i + dir + n) % n); setFlash((f) => f + 1); setTouched(true); };

  const onDown = (e) => { startX.current = e.clientX; setDragging(true); e.currentTarget.setPointerCapture?.(e.pointerId); };
  const onMove = (e) => { if (startX.current !== null) setDragX(e.clientX - startX.current); };
  const onUp = () => {
    if (startX.current === null) return;
    if (dragX < -40) go(1); else if (dragX > 40) go(-1);
    startX.current = null; setDragX(0); setDragging(false);
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  };

  const current = photos[index];
  const pad = (v) => String(v).padStart(2, "0");

  return (
    <div className={touched ? "camera-carousel touched" : "camera-carousel"} role="region" aria-roledescription="carousel" aria-label="Photography" tabIndex={0} onKeyDown={onKey}>
      <div className="camera-area">
        <div className="camera-stage">
          <div className={dragging ? "camera-screen is-dragging" : "camera-screen"}
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            {photos.map((photo, i) => {
              let d = i - index;
              if (d > n / 2) d -= n;
              if (d < -n / 2) d += n;
              return (
                <div key={photo.title} className={`slide photo-art ${photo.src ? "" : photo.tone}`}
                  style={{ transform: `translateX(calc(${d * 100}% + ${dragX}px))`, opacity: Math.abs(d) > 1 ? 0 : 1 }}
                  aria-hidden={d !== 0} role="group" aria-label={`${i + 1} of ${n}`}>
                  {photo.src
                    ? <img src={photo.src} alt={photo.alt || photo.title} draggable="false" />
                    : <PlaceholderArt tone={photo.tone} />}
                </div>
              );
            })}
            <span className="screen-osd" aria-hidden="true">{pad(index + 1)}/{pad(n)}</span>
            {flash > 0 && <span key={flash} className="shutter-flash" aria-hidden="true" />}
          </div>
          <img className="camera-frame" src={cameraFrame} alt="" aria-hidden="true" draggable="false" />

          <button className="cam-hit hit-prev" onClick={() => go(-1)} aria-label="Previous photo" title="Previous photo" />
          <button className="cam-hit hit-next" onClick={() => go(1)} aria-label="Next photo" title="Next photo" />
          <button className="cam-hit hit-shutter" onClick={() => go(1)} aria-label="Next photo (shutter button)" title="Next photo" />

          <div className="cam-hint" aria-hidden="true">
            <svg viewBox="0 0 120 40" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M118 28 C 88 40, 46 34, 8 17" />
              <path d="M18 10 L7 16.5 L19 23" />
            </svg>
            <span>press ▸ to flip<br />through the photos</span>
          </div>
        </div>
      </div>

      <div className="camera-meta">
        <div className="camera-caption" aria-live="polite">
          
          <h3>{current.title}</h3>
        </div>
        <p className="hint-line">Press ◂ ▸ on the dial, or swipe the screen.</p>
      </div>
    </div>
  );
}

const captions = [
  { title: "Designer by day.", text: "Untangling complicated workflows into something clear." },
  { title: "Climber on weekends.", text: "Always looking for the next hold, the next perspective." },
  { title: "Diver when I can.", text: "Slowing down enough to notice the details." },
  { title: "A camera never far.", text: "Collecting small moments that make me pause." },
];


// Local SVG illustrations keep all four backgrounds crisp without external assets.
function AvatarBackdrop({ step }) {
  const palettes = ["#b5a0c7", "#d5a183", "#7faeac", "#a79abb"];
  const icon = (kind, n) => {
    const c = palettes[step];
    switch (kind) {
      case "figma": return <g transform="translate(31 15)"><path d="M19 0H9a10 10 0 0 0 0 20h10Z" fill="#f08070"/><path d="M19 0h10a10 10 0 0 1 0 20H19Z" fill="#eaa6a0"/><path d="M19 20H9a10 10 0 0 0 0 20h10Z" fill="#b19bcd"/><circle cx="29" cy="30" r="10" fill="#8bc4dc"/><path d="M19 40H9a10 10 0 1 0 10 10Z" fill="#8cb9a0"/></g>;
      case "code": return <g fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"><path d="m32 30-20 20 20 20m36-40 20 20-20 20M58 22 43 78"/></g>;
      case "brush": return <g transform="rotate(30 50 50)"><rect x="44" y="8" width="12" height="50" rx="6" fill="#b99b77"/><path d="M40 54h20v16H40Z" fill="#d0c4cf"/><path d="M40 68h20q8 25-27 24 12-8 7-24" fill={c}/></g>;
      case "hold": return <g><path d={n%2 ? "M18 60Q5 38 29 24L66 16Q90 16 88 43L72 75Q50 96 23 79Z" : "M16 34Q27 9 54 21L81 38Q97 60 76 79L39 84Q12 78 16 34Z"} fill={["#dba18e","#b3a0c8","#a1b38a","#e2c77e","#8eafb4","#d19cad"][n%6]}/><path d="M30 39q18-15 39 0" fill="none" stroke="#fff" strokeOpacity=".32" strokeWidth="7" strokeLinecap="round"/><circle cx="51" cy="58" r="4" fill="#6c6173" opacity=".6"/></g>;
      case "fish": return <g transform={n%2 ? "translate(100 0) scale(-1 1)" : undefined}><path d="m71 49 22-20v42Z" fill={c}/><ellipse cx="43" cy="50" rx="32" ry={n%3===0?27:19} fill={["#d8b778","#8eb7bd","#b3a1cb","#dcaa9c"][n%4]}/><path d="m34 34 10-16 12 18m-19 31 12 14 8-14" fill={c}/><circle cx="24" cy="46" r="3" fill="#51435c"/><path d="M43 38q-9 12 0 24" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4"/></g>;
      case "polaroid": return <g><rect x="18" y="11" width="66" height="80" rx="3" fill="#fffaf0"/><path d="M24 18h54v51H24Z" fill="#b3c2b4"/><circle cx="64" cy="31" r="8" fill="#e9d49a"/><path d="m24 69 20-29 14 17 11-12 9 24" fill="#879b94"/><path d="M38 80h28" stroke={c} strokeWidth="3" strokeLinecap="round"/></g>;
      default: return <g><path d="M17 30h17l7-11h23l7 11h12q6 0 6 7v40H11V37q0-7 6-7" fill={n%2?"#8caaa4":c}/><path d="M11 40h78v10H11Z" fill="#ede3d5"/><circle cx="51" cy="56" r="21" fill="#e8ddd0"/><circle cx="51" cy="56" r="15" fill="#63566f"/><circle cx="47" cy="51" r="5" fill="#b2b7c9"/><rect x="72" y="34" width="9" height="5" rx="2" fill="#fff7e8"/></g>;
    }
  };
  const kinds = [["figma","brush","code","figma","brush","code"],Array(6).fill("hold"),Array(6).fill("fish"),Array(6).fill("polaroid")][step];
  return <div className="avatar-props" key={step}>{kinds.map((kind,n)=><svg className={`avatar-prop prop-${n}`} key={n} viewBox="0 0 100 100" aria-hidden="true">{icon(kind,n)}</svg>)}</div>;
}

function AvatarSection() {
  const sectionRef = React.useRef(null);
  const progress = React.useRef(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let frame = null;
    const update = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = sectionRef.current; if (!el) return;
        const stick = el.firstElementChild;
        const top = parseFloat(getComputedStyle(stick).top) || 0;
        const range = Math.max(1, el.offsetHeight - stick.offsetHeight);
        const p = Math.max(0, Math.min(1, (top - el.getBoundingClientRect().top) / range));
        progress.current = p;
        el.style.setProperty("--p", p.toFixed(4));
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); if (frame) cancelAnimationFrame(frame); };
  }, []);

  return (
    <section className="avatar-section" id="avatar" ref={sectionRef} aria-label="Meet my avatar">
      <div className="avatar-sticky">
        <div className="avatar-bg" aria-hidden="true">
          <AvatarBackdrop step={step} />
          <div className="avatar-ground" />
        </div>
        <Avatar3D progressRef={progress} onStep={setStep} />
        <div className="avatar-captions" aria-live="polite">
          {captions.map((c, i) => (
            <div key={c.title} className={`cap ${i % 2 ? "cap-right" : "cap-left"}${i === step ? " active" : ""}`}>
              <h3>{c.title}</h3><p>{c.text}</p>
            </div>
          ))}
        </div>
        <div className="avatar-progress" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}

function BloomTrail() {
  const ref = React.useRef(null);
  useEffect(() => {
    const canvas = ref.current, host = canvas.parentElement, ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // same bud artwork as the page-2 flowers (viewBox 0 0 140 220)
    const stem = new Path2D("M70 220 C69 172 72 128 72 81");
    const leaves = [["M70 175 C28 172 20 144 17 130 C48 131 66 148 70 175Z", "#9da47b"], ["M72 148 C107 144 119 120 121 104 C91 107 76 126 72 148Z", "#8d986f"]].map(([d, c]) => [new Path2D(d), c]);
    const petals = [
      ["M70 95 C34 81 33 43 51 24 C61 11 80 10 91 24 C111 47 103 81 70 95Z", "#cbb9d0", 0],
      ["M70 94 C53 67 59 32 71 17 C84 37 86 68 70 94Z", "#e7dce7", 0.12],
      ["M70 95 C41 82 28 58 41 39 C51 53 58 72 70 95Z", "#b5a0bf", -0.6],
      ["M70 95 C98 79 111 55 98 38 C90 56 79 77 70 95Z", "#d8c8dc", 0.6],
      ["M70 95 C50 74 43 50 53 28 C68 46 72 68 70 95Z", "#c8b3cf", -0.28],
    ].map(([d, c, r]) => [new Path2D(d), c, r]);
    const flowers = []; let raf = null, last = null, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = host.clientWidth * dpr; canvas.height = host.clientHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const back = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2; };
    const clamp = (x) => Math.max(0, Math.min(1, x));
    const draw = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      for (let i = flowers.length - 1; i >= 0; i--) {
        const f = flowers[i], age = (now - f.t) / 1000;
        if (age > f.life) { flowers.splice(i, 1); continue; }
        const grow = reduce ? 1 : Math.max(0.001, back(clamp(age / 0.75))), open = reduce ? 1 : back(clamp((age - 0.25) / 0.8));
        const sc = f.h / 220;
        ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.tilt + (reduce ? 0 : Math.sin(age * 1.5 + f.ph) * 0.045)); ctx.scale(sc, sc);
        ctx.globalAlpha = clamp((f.life - age) / 1.2);
        ctx.translate(-70, -60);                       // bud head lands on the cursor
        ctx.translate(70, 220); ctx.scale(grow, grow); ctx.translate(-70, -220); // sprouts upward from its base
        ctx.strokeStyle = "#7e8661"; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.stroke(stem);
        leaves.forEach(([p, c]) => { ctx.fillStyle = c; ctx.fill(p); });
        petals.forEach(([p, c, r]) => { ctx.save(); ctx.translate(70, 95); ctx.rotate(r * open); ctx.scale(1 + 0.06 * open, 1 + 0.06 * open); ctx.translate(-70, -95); ctx.fillStyle = c; ctx.fill(p); ctx.restore(); });
        ctx.restore();
      }
      raf = flowers.length ? requestAnimationFrame(draw) : null;
    };
    const spawn = (x, y, big = 1) => {
      if (flowers.length > 60) flowers.shift();
      flowers.push({ x, y, h: (85 + Math.random() * 65) * big, tilt: (Math.random() - 0.5) * 0.7, ph: Math.random() * 6, t: performance.now(), life: 3.6 + Math.random() * 1.6 });
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const local = (cx, cy) => { const r = canvas.getBoundingClientRect(); return [cx - r.left, cy - r.top, r]; };
    const move = (cx, cy) => {
      const [x, y, r] = local(cx, cy);
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      if (!last || Math.hypot(x - last[0], y - last[1]) > 56) { spawn(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20); last = [x, y]; }
    };
    const onMove = (e) => move(e.clientX, e.clientY);
    const onTouch = (e) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); };
    const onDown = (e) => { const [x, y] = local(e.clientX, e.clientY); for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; spawn(x + Math.cos(a) * 70, y + Math.sin(a) * 50, 1.1); } };
    host.addEventListener("pointermove", onMove); host.addEventListener("touchmove", onTouch, { passive: true }); host.addEventListener("pointerdown", onDown);
    const ro = new ResizeObserver(resize); ro.observe(host); resize();
    return () => { host.removeEventListener("pointermove", onMove); host.removeEventListener("touchmove", onTouch); host.removeEventListener("pointerdown", onDown); ro.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <canvas className="bloom-trail" ref={ref} aria-hidden="true" />;
}

function Arrow({ diagonal = false }) {
  return <span className="arrow" aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

export default function App() {
  const [bloom, setBloom] = useState(0);
  const [active, setActive] = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = null;
    const update = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = Math.max(1, window.innerHeight * 0.9);
        setBloom(Math.max(0, Math.min(1, window.scrollY / max)));
        const sections = ["about", "work", "contact"];
        let current = "About";
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top < window.innerHeight * 0.42) current = id === "about" ? "About" : id[0].toUpperCase() + id.slice(1);
        }
        setActive(current);
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", update); if (frame) cancelAnimationFrame(frame); };
  }, []);


  useEffect(() => {
    if (!menuOpen) return;
    const close = e => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  const goTo = (id, label) => {
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setActive(label);
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <main>
        <section className="hero" id="top" aria-label="Introduction">
          <BloomTrail />
          <div className="hero-copy" style={{ transform: `translateY(${bloom * -70}px) scale(${1 - bloom * 0.06})`, opacity: 1 - bloom * 0.85 }}>
            <h1>hi, i’m<br /><em>lock yin</em></h1>
          </div>
          <div className="hero-bottom-note"><span>MOVE TO BLOOM</span><span className="scroll-line" /></div>
          <span className="hero-index">01 / 03</span>
        </section>

        <AvatarSection />

        <AboutPlayground camera={<PhotoCarousel />} />

        <WorkShowcase />

        <section className="contact-section section-pad" id="contact">
          <div className="section-kicker"><span>03</span><span>YOUR TURN</span></div>
          <div className="contact-content"><span className="contact-mark" aria-hidden="true">✳</span><p className="eyebrow">A GOOD CONVERSATION IS A LOVELY START</p><h2>Let’s make<br /><em>something meaningful.</em></h2><p>A project, a question, or a fresh perspective. I’d love to hear what’s on your mind.</p>{portfolioProfile.email ? <a className="pill-button" href={`mailto:${portfolioProfile.email}`}>{portfolioProfile.email} <Arrow diagonal /></a> : <p className="contact-pending">Contact details coming soon</p>}<div className="social-links">{portfolioProfile.linkedin && <a href={portfolioProfile.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow diagonal /></a>}{portfolioProfile.instagram && <a href={portfolioProfile.instagram} target="_blank" rel="noreferrer">Instagram <Arrow diagonal /></a>}</div></div>
          <footer className="footer"><span>Made with curiosity & a little bit of CSS.</span><span>© {new Date().getFullYear()} · LOCK YIN</span><button onClick={() => goTo("top","About")}>BACK TO TOP ↑</button></footer>
        </section>
      </main>
    </div>
  );
}
