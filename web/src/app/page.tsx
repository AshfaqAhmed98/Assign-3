"use client";

import Image from "next/image";
import { ArrowDownRight, Clock3, Flame, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { type Workout, workoutsApi } from "@/lib/workouts";

const starterWorkouts: Workout[] = [];

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>(starterWorkouts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(workoutsApi)
      .then((response) => response.json())
      .then((data: Workout[] | { value: Workout[] }) => setWorkouts(Array.isArray(data) ? data : data.value))
      .finally(() => setLoading(false));
  }, []);

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
        <section id="library" className="library-section" aria-labelledby="library-heading">
          <div className="library-heading">
            <div>
              <h2 id="library-heading">THE LIBRARY</h2>
              <p>Twelve lifts covering every major muscle group.</p>
            </div>
          </div>
          {loading && <p className="library-status">Loading workouts...</p>}
          {!loading && <div className="workout-grid">{workouts.map((workout) => <a className="workout-card" href={`/workouts/${workout.id}`} key={workout.id}>
            <div className="workout-image"><img src={workout.image} alt={workout.name} /><span className="difficulty-badge">{workout.difficulty.toUpperCase()}</span></div>
            <div className="workout-body"><div className="group-tags">{workout.muscleGroups.map((group) => <span key={group}>{group.toUpperCase()}</span>)}</div><h3>{workout.name.toUpperCase()}</h3><p>{workout.equipment}</p><div className="workout-meta"><span><Clock3 size={12} /> {workout.duration} min</span><span><Flame size={12} /> {workout.caloriesBurned} kcal</span><span><Star size={12} fill="currentColor" /> {workout.rating}</span></div></div>
          </a>)}</div>}
        </section>
      </main>
    </div>
  );
}
