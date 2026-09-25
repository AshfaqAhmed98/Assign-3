"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Clock3, Flame, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { type Workout, workoutsApi } from "@/lib/workouts";

const starterWorkouts: Workout[] = [];

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>(starterWorkouts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadWorkouts = async () => {
      try {
        const response = await fetch(workoutsApi, { cache: "no-store" });
        const data: Workout[] | { value: Workout[] } = await response.json();
        const nextWorkouts = Array.isArray(data) ? data : data.value;

        if (isMounted) {
          setWorkouts(Array.isArray(nextWorkouts) ? nextWorkouts : []);
        }
      } catch {
        if (isMounted) {
          setWorkouts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadWorkouts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="fit-navbar">
        <Link className="fit-brand" href="/#top" aria-label="Fitlog home">
          <Image src="/logo.png" alt="" width={25} height={25} priority />
          <span>FITLOG</span>
        </Link>
        <nav className="fit-nav-links" aria-label="Primary navigation">
          <Link className="fit-nav-link active" href="/#library">Workouts</Link>
          <Link className="fit-nav-link" href="/my-plan">My Plan</Link>
        </nav>
        <div className="fit-nav-status">
          <Link className="status-link" href="/my-plan?tab=plan">Plan <span className="plan-count">0</span></Link>
          <Link className="status-link saved-status" href="/my-plan?tab=saved">Saved <span className="saved-count">0</span></Link>
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
        <section id="library" className="library-section" aria-labelledby="library-heading">
          <div className="library-heading">
            <div>
              <h2 id="library-heading">THE LIBRARY</h2>
              <p>Twelve lifts covering every major muscle group.</p>
            </div>
          </div>
          {loading && (
            <div className="library-loading" aria-live="polite">
              <span className="loading-spinner" aria-hidden="true" />
              <span>Loading workouts...</span>
            </div>
          )}
          {!loading && workouts.length > 0 && <div className="workout-grid">{workouts.map((workout) => <a className="workout-card" href={`/workouts/${workout.id}`} key={workout.id}>
            <div className="workout-image"><img src={workout.image} alt={workout.name} /><span className="difficulty-badge">{workout.difficulty.toUpperCase()}</span></div>
            <div className="workout-body"><div className="group-tags">{workout.muscleGroups.map((group) => <span key={group}>{group.toUpperCase()}</span>)}</div><h3>{workout.name.toUpperCase()}</h3><p>{workout.equipment}</p><div className="workout-meta"><span><Clock3 size={12} /> {workout.duration} min</span><span><Flame size={12} /> {workout.caloriesBurned} kcal</span><span><Star size={12} fill="currentColor" /> {workout.rating}</span></div></div>
          </a>)}</div>}
          {!loading && workouts.length === 0 && <p className="library-status">Workouts unavailable right now. Please try again in a moment.</p>}
        </section>
      </main>

      <footer className="fit-footer">
        <div className="fit-footer-content">
          <div className="fit-brand fit-footer-brand" aria-label="Fitlog home">
            <Image src="/logo.png" alt="" width={20} height={20} priority />
            <span>FITLOG</span>
          </div>
          <p>© 2026 FitLog — Workout Library. Train hard, log honest.</p>
        </div>
      </footer>
    </div>
  );
}
