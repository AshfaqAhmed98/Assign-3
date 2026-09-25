"use client";

import { Bookmark, Check } from "lucide-react";
import { useState } from "react";
import type { Workout } from "@/lib/workouts";

const planKey = "fitlog-plan";
const savedKey = "fitlog-saved";

function addWorkout(key: string, id: number) {
  if (typeof window === "undefined") return false;

  const current = JSON.parse(window.localStorage.getItem(key) ?? "[]") as number[];
  if (current.includes(id)) return false;
  window.localStorage.setItem(key, JSON.stringify([...current, id]));
  window.dispatchEvent(new Event("fitlog-storage"));
  return true;
}

export default function DetailActions({ workout }: { workout: Workout }) {
  const [toast, setToast] = useState("");

  const handleAdd = (key: string, message: string) => {
    const added = addWorkout(key, workout.id);
    setToast(added ? message : "Already added");

    if (key === savedKey) {
      window.setTimeout(() => {
        window.location.href = "/my-plan?tab=saved";
      }, 350);
      return;
    }

    window.setTimeout(() => setToast(""), 2200);
  };

  return <>
    <div className="detail-actions">
      <button className="detail-primary" onClick={() => handleAdd(planKey, "Added to today's plan")}><Check size={16} /> Add to today's plan</button>
      <button className="detail-secondary" onClick={() => handleAdd(savedKey, "Saved for later")}><Bookmark size={16} /> Save for later</button>
    </div>
    {toast && (
      <div className="fit-toast" role="status">
        <span className="fit-toast-icon"><Check size={14} /></span>
        <span>{toast}</span>
      </div>
    )}
  </>;
}
