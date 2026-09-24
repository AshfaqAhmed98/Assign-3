"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FitNavbar from "@/components/FitNavbar";
import { type Workout, workoutsApi } from "@/lib/workouts";

const planKey = "fitlog-plan";
const savedKey = "fitlog-saved";

function readIds(key: string) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value as number[] : [];
  } catch {
    return [];
  }
}

export default function MyPlan() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [tab, setTab] = useState<"plan" | "saved">("plan");
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    const sync = () => setIds(readIds(tab === "plan" ? planKey : savedKey));
    sync();
    const load = async () => {
      const response = await fetch(workoutsApi);
      const data: Workout[] | { value: Workout[] } = await response.json();
      setWorkouts(Array.isArray(data) ? data : data.value);
    };
    load();
    window.addEventListener("fitlog-storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("fitlog-storage", sync);
      window.removeEventListener("storage", sync);
    };
  }, [tab]);

  const visible = workouts.filter((workout) => ids.includes(workout.id));

  return <div className="plan-page">
    <FitNavbar />
    <main className="plan-content">
      <p className="detail-eyebrow">YOUR WORKOUTS</p>
      <h1>MY PLAN</h1>
      <div className="plan-tabs"><button className={tab === "plan" ? "plan-tab active" : "plan-tab"} onClick={() => setTab("plan")}>TODAY&apos;S PLAN</button><button className={tab === "saved" ? "plan-tab active" : "plan-tab"} onClick={() => setTab("saved")}>SAVED</button></div>
      {visible.length === 0 ? <div className="empty-plan"><h2>{tab === "plan" ? "No workouts planned yet" : "No saved workouts yet"}</h2><p>Explore the library and add a workout to see it here.</p><Link href="/#library" className="detail-primary">Browse workouts</Link></div> : <div className="plan-grid">{visible.map((workout) => <article className="plan-card" key={workout.id}><Image src={workout.image} alt={workout.name} width={180} height={130} /><div><p>{workout.muscleGroups.join(" / ")}</p><h2>{workout.name}</h2><span>{workout.duration} min · {workout.caloriesBurned} kcal</span><Link href={`/workouts/${workout.id}`}>View Details</Link></div></article>)}</div>}
    </main>
  </div>;
}
