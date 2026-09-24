import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bookmark, Check } from "lucide-react";
import { workoutsApi, type Workout } from "@/lib/workouts";

async function getWorkout(id: string): Promise<Workout | undefined> {
  const response = await fetch(workoutsApi, { cache: "no-store" });
  const data: Workout[] | { value: Workout[] } = await response.json();
  const workouts = Array.isArray(data) ? data : data.value;
  return workouts.find((workout) => String(workout.id) === id);
}

export default async function WorkoutDetail({ params }: PageProps<"/workouts/[id]">) {
  const workout = await getWorkout((await params).id);

  if (!workout) {
    return <main className="detail-missing"><h1>Workout not found</h1><Link href="/#library">Back to library</Link></main>;
  }

  return <div className="detail-page">
    <header className="detail-topbar"><Link href="/#library" className="detail-back"><ArrowLeft size={16} /> Back to library</Link><span>WORKOUT DETAILS</span></header>
    <main className="detail-layout">
      <div className="detail-visual"><Image src={workout.image} alt={workout.name} fill sizes="(max-width: 800px) 100vw, 50vw" priority /></div>
      <article className="detail-content"><p className="detail-eyebrow">{workout.muscleGroups.join(" / ").toUpperCase()}</p><h1>{workout.name.toUpperCase()}</h1><p className="detail-description">{workout.description}</p><div className="detail-tags">{workout.muscleGroups.map((group) => <span key={group}>{group}</span>)}</div>
        <section className="spec-panel"><h2>KEY SPECS</h2><div className="spec-grid"><span>EQUIPMENT<strong>{workout.equipment}</strong></span><span>DIFFICULTY<strong>{workout.difficulty}</strong></span><span>SETS<strong>{workout.sets}</strong></span><span>REPS<strong>{workout.reps}</strong></span><span>DURATION<strong>{workout.duration} min</strong></span><span>CALORIES<strong>{workout.caloriesBurned} kcal</strong></span><span>RATING<strong>{workout.rating}</strong></span></div></section>
        <section className="instructions"><h2>INSTRUCTIONS</h2><ol>{workout.instructions.map((instruction, index) => <li key={instruction}><span>{String(index + 1).padStart(2, "0")}</span>{instruction}</li>)}</ol></section>
        <div className="detail-actions"><button className="detail-primary"><Check size={16} /> Add to today&apos;s plan</button><button className="detail-secondary"><Bookmark size={16} /> Save for later</button></div>
      </article>
    </main>
  </div>;
}
