"use client";

import { Bookmark, Check } from "lucide-react";
import { useState } from "react";
import type { Workout } from "@/lib/workouts";

const planKey = "fitlog-plan";
const savedKey = "fitlog-saved";

function addWorkout(key: string, id: number) {
  const current = JSON.parse(window.localStorage.getItem(key) ?? "[]") as number[];
  if (current.includes(id)) return false;
  window.localStorage.setItem(key, JSON.stringify([...current, id]));
  window.dispatchEvent(new Event("fitlog-storage"));
  return true;
}

export default function DetailActions({ workout }: { workout: Workout }) {
  const [toast, setToast] = useState("");

  const handleAdd = (key: string, message: string) => {
    setToast(addWorkout(key, workout.id) ? message : "Already added");
    window.setTimeout(() => setToast(""), 2200);
  };

  return <>
    <div className="detail-actions">
      <button className="detail-primary" onClick={() => handleAdd(planKey, "Added to today&apos;s plan")}><Check size={16} /> Add to today&apos;s plan</button>
      <button className="detail-secondary" onClick={() => handleAdd(savedKey, "Saved for later")}><Bookmark size={16} /> Save for later</button>
    </div>
    {toast && <div className="fit-toast" role="status">{toast}</div>}
  </>;
}
