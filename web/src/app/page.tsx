import Image from "next/image";
import { ArrowDownRight } from "lucide-react";

export default function Home() {
  return (
    <div className="app-shell">
      <header className="fit-navbar">
        <a className="fit-brand" href="#top" aria-label="Fitlog home">
          <Image src="/logo.png" alt="" width={25} height={25} priority />
          <span>FITLOG</span>
        </a>
        <nav className="fit-nav-links" aria-label="Primary navigation">
          <a className="fit-nav-link active" href="#workouts">Workouts</a>
          <a className="fit-nav-link" href="#plan">My Plan</a>
        </nav>
        <div className="fit-nav-status">
          <a className="status-link" href="/my-plan">Plan <span className="plan-count">0</span></a>
          <a className="status-link saved-status" href="/my-plan">Saved <span className="saved-count">0</span></a>
        </div>
      </header>
      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="hero-eyebrow">WORKOUT LIBRARY</p>
            <h1 id="hero-heading">TRAIN WITH INTENT. LOG<br />EVERY SET.</h1>
            <p className="hero-subtitle">FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.</p>
            <a className="hero-cta" href="#library">BROWSE WORKOUTS <ArrowDownRight size={17} strokeWidth={2.5} /></a>
          </div>
          <div className="hero-art"><Image src="/banner.png" alt="Person exercising on a gym machine" width={343} height={343} priority /></div>
        </section>
        <section id="library" className="library-anchor" aria-label="Workout library" />
      </main>
    </div>
  );
}
