"use client";

import { Clock3, Flame, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FitNavbar from "@/components/FitNavbar";
import type { Workout } from "@/lib/workouts";
import { workoutsApi } from "@/lib/workouts";

const planKey = "fitlog-plan";
const savedKey = "fitlog-saved";

function readIds(key: string): number[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? (value as number[]) : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: number[]) {
  window.localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new Event("fitlog-storage"));
}

export default function MyPlanPage() {
  const [tab, setTab] = useState<"plan" | "saved">("plan");
  const [planIds, setPlanIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncFromStorage = () => {
      setPlanIds(readIds(planKey));
      setSavedIds(readIds(savedKey));
    };

    syncFromStorage();
    window.addEventListener("fitlog-storage", syncFromStorage);
    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener("fitlog-storage", syncFromStorage);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadWorkouts = async () => {
      setLoading(true);
      try {
        const response = await fetch(workoutsApi);
        const data: Workout[] | { value: Workout[] } = await response.json();
        const nextWorkouts = Array.isArray(data) ? data : data.value;
        if (isMounted) setWorkouts(nextWorkouts ?? []);
      } catch {
        if (isMounted) setWorkouts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadWorkouts();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeIds = tab === "plan" ? planIds : savedIds;
  const visibleWorkouts = useMemo(
    () => workouts.filter((workout) => activeIds.includes(workout.id)),
    [workouts, activeIds],
  );

  const exercises = activeIds.length;
  const minutes = visibleWorkouts.reduce((total, workout) => total + workout.duration, 0);
  const calories = visibleWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0);

  const removeWorkout = (id: number) => {
    const targetKey = tab === "plan" ? planKey : savedKey;
    const current = readIds(targetKey);
    const next = current.filter((value) => value !== id);
    writeIds(targetKey, next);
    if (tab === "plan") setPlanIds(next);
    else setSavedIds(next);
  };

  const markDone = (id: number) => {
    const current = readIds(planKey);
    const next = current.filter((value) => value !== id);
    writeIds(planKey, next);
    setPlanIds(next);
  };

  return (
    <div className="plan-page">
      <FitNavbar />

      <main className="plan-content">
        <h1>MY PLAN</h1>
        <p className="plan-subtitle">
          Cap of five lifts for today. Finish them, then load more.
        </p>

        <div className="plan-summary" aria-label="Workout summary">
          <div className="plan-stat-card">
            <span>Exercises</span>
            <strong>{exercises}</strong>
          </div>
          <div className="plan-stat-card">
            <span>Minutes</span>
            <strong>{minutes}</strong>
          </div>
          <div className="plan-stat-card">
            <span>Calories</span>
            <strong>{calories}</strong>
          </div>
        </div>

        <div className="plan-toolbar">
          <div className="plan-tabs" role="tablist" aria-label="Plan tabs">
            <button
              type="button"
              className={tab === "plan" ? "plan-tab active" : "plan-tab"}
              onClick={() => setTab("plan")}
            >
              Today&apos;s Plan
            </button>
            <button
              type="button"
              className={tab === "saved" ? "plan-tab active" : "plan-tab"}
              onClick={() => setTab("saved")}
            >
              Saved
            </button>
          </div>

          <button type="button" className="plan-sort-button">
            Sort By
          </button>
        </div>

        {loading ? (
          <div className="plan-loading">Loading workouts...</div>
        ) : visibleWorkouts.length === 0 ? (
          <div className="empty-plan">
            <h2>NOTHING HERE YET</h2>
            <p>Browse the library and add a lift to get today moving.</p>
            <Link href="/" className="plan-empty-button">
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="plan-list">
            {visibleWorkouts.map((workout) => (
              <article className="plan-card" key={workout.id}>
                <div className="plan-card-image">
                  <Image src={workout.image} alt={workout.name} width={180} height={120} />
                </div>

                <div className="plan-card-body">
                  <div className="plan-card-head">
                    <div>
                      <p className="plan-card-equipment">{workout.equipment}</p>
                      <h2>{workout.name}</h2>
                    </div>

                    <button
                      type="button"
                      className="plan-close"
                      aria-label={`Remove ${workout.name}`}
                      onClick={() => removeWorkout(workout.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="plan-card-metrics">
                    <span>
                      <Clock3 size={14} /> {workout.duration} min
                    </span>
                    <span>
                      <Flame size={14} /> {workout.caloriesBurned} kcal
                    </span>
                    <span>
                      <Star size={14} /> {workout.rating}.0
                    </span>
                  </div>

                  <div className="plan-card-actions">
                    <Link href={`/workouts/${workout.id}`} className="plan-view-button">
                      View Details
                    </Link>
                    <button
                      type="button"
                      className="plan-done-button"
                      onClick={() => markDone(workout.id)}
                    >
                      Mark as Done
                    </button>
                    <button
                      type="button"
                      className="plan-remove-button"
                      aria-label={`Remove ${workout.name}`}
                      onClick={() => removeWorkout(workout.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="plan-footer">
        <div className="plan-footer-brand">
          <Image src="/logo.png" alt="FitLog logo" width={18} height={18} />
          <span>FITLOG</span>
        </div>
        <p>© 2026 FitLog — Workout Library. Train hard, log honest.</p>
      </footer>
    </div>
  );
}
