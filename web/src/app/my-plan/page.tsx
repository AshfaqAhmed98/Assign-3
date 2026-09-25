"use client";

import { ChevronDown, Clock3, Flame, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FitNavbar from "@/components/FitNavbar";
import type { Workout } from "@/lib/workouts";
import { workoutsApi } from "@/lib/workouts";

const planKey = "fitlog-plan";
const savedKey = "fitlog-saved";

function readIds(key: string): number[] {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? (value as number[]) : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: number[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new Event("fitlog-storage"));
}

type SortKey = "duration" | "calories" | "rating";

export default function MyPlanPage() {
  const [tab, setTab] = useState<"plan" | "saved">("plan");
  const [sortBy, setSortBy] = useState<SortKey>("duration");
  const [planIds, setPlanIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const syncTabFromLocation = () => {
      const params = new URLSearchParams(window.location.search);
      const nextTab = params.get("tab") === "saved" ? "saved" : "plan";
      setTab(nextTab);
    };

    syncTabFromLocation();
    window.addEventListener("popstate", syncTabFromLocation);
    window.addEventListener("plan-tab-change", syncTabFromLocation);

    return () => {
      window.removeEventListener("popstate", syncTabFromLocation);
      window.removeEventListener("plan-tab-change", syncTabFromLocation);
    };
  }, []);

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

  const sortedWorkouts = useMemo(() => {
    const next = [...visibleWorkouts];

    next.sort((a, b) => {
      if (sortBy === "calories") return b.caloriesBurned - a.caloriesBurned;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.duration - a.duration;
    });

    return next;
  }, [sortBy, visibleWorkouts]);

  const exercises = activeIds.length;
  const minutes = visibleWorkouts.reduce((total, workout) => total + workout.duration, 0);
  const calories = visibleWorkouts.reduce((total, workout) => total + workout.caloriesBurned, 0);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const removeWorkout = (id: number) => {
    const targetKey = tab === "plan" ? planKey : savedKey;
    const current = readIds(targetKey);
    const next = current.filter((value) => value !== id);
    writeIds(targetKey, next);
    if (tab === "plan") setPlanIds(next);
    else setSavedIds(next);
    notify(tab === "plan" ? "Workout removed from plan" : "Workout removed from saved");
  };

  const removeAll = () => {
    const targetKey = tab === "plan" ? planKey : savedKey;
    writeIds(targetKey, []);
    if (tab === "plan") setPlanIds([]);
    else setSavedIds([]);
    notify(tab === "plan" ? "All workouts removed from plan" : "All saved workouts removed");
  };

  const markDone = (id: number) => {
    const current = readIds(planKey);
    const next = current.filter((value) => value !== id);
    writeIds(planKey, next);
    setPlanIds(next);
    notify("Workout marked as done");
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
              onClick={() => {
                setTab("plan");
                window.history.replaceState({}, "", "/my-plan?tab=plan");
                window.dispatchEvent(new Event("plan-tab-change"));
              }}
            >
              Today&apos;s Plan
            </button>
            <button
              type="button"
              className={tab === "saved" ? "plan-tab active" : "plan-tab"}
              onClick={() => {
                setTab("saved");
                window.history.replaceState({}, "", "/my-plan?tab=saved");
                window.dispatchEvent(new Event("plan-tab-change"));
              }}
            >
              Saved
            </button>
          </div>

          <div className="plan-actions-inline">
            <button
              type="button"
              className="plan-remove-all-button"
              onClick={removeAll}
              disabled={activeIds.length === 0}
            >
              <X size={14} /> Remove All
            </button>

            <label className="plan-sort-wrapper" htmlFor="plan-sort">
              <span className="plan-sort-label">Sort By</span>
              <div className="plan-sort-field">
                <select
                  id="plan-sort"
                  className="plan-sort-select"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortKey)}
                >
                  <option value="duration">Duration</option>
                  <option value="calories">Calories</option>
                  <option value="rating">Rating</option>
                </select>
                <ChevronDown size={14} className="plan-sort-chevron" />
              </div>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="plan-loading">Loading workouts...</div>
        ) : sortedWorkouts.length === 0 ? (
          <div className="empty-plan">
            <h2>NOTHING HERE YET</h2>
            <p>Browse the library and add a lift to get today moving.</p>
            <Link href="/" className="plan-empty-button">
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="plan-list">
            {sortedWorkouts.map((workout) => (
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
                      <X size={16} />
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
                    {tab === "plan" && (
                      <button
                        type="button"
                        className="plan-done-button"
                        onClick={() => markDone(workout.id)}
                      >
                        Mark as Done
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {toast && (
          <div className="fit-toast" role="status">
            <span className="fit-toast-icon"><Star size={12} fill="currentColor" /></span>
            <span>{toast}</span>
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
