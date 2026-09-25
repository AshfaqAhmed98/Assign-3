import Image from "next/image";
import Link from "next/link";
import { getWorkoutById } from "@/lib/workouts";
import DetailActions from "@/components/DetailActions";
import FitNavbar from "@/components/FitNavbar";

export default async function WorkoutDetail({ params }: PageProps<"/workouts/[id]">) {
  const workout = await getWorkoutById((await params).id);

  if (!workout) {
    return <main className="detail-missing"><h1>Workout not found</h1><Link href="/#library">Back to library</Link></main>;
  }

  return <div className="detail-page">
    <FitNavbar />
    <main className="detail-layout">
      <div className="detail-visual"><Image src={workout.image} alt={workout.name} fill sizes="(max-width: 800px) 100vw, 50vw" priority /></div>
      <article className="detail-content"><p className="detail-eyebrow">{workout.muscleGroups.join(" / ").toUpperCase()}</p><h1>{workout.name.toUpperCase()}</h1><p className="detail-description">{workout.description}</p><div className="detail-tags">{workout.muscleGroups.map((group) => <span key={group}>{group}</span>)}</div>
        <section className="spec-panel"><h2>KEY SPECS</h2><div className="spec-grid"><span>EQUIPMENT<strong>{workout.equipment}</strong></span><span>DIFFICULTY<strong>{workout.difficulty}</strong></span><span>SETS<strong>{workout.sets}</strong></span><span>REPS<strong>{workout.reps}</strong></span><span>DURATION<strong>{workout.duration} min</strong></span><span>CALORIES<strong>{workout.caloriesBurned} kcal</strong></span><span>RATING<strong>{workout.rating}</strong></span></div></section>
        <section className="instructions"><h2>INSTRUCTIONS</h2><ol>{workout.instructions.map((instruction, index) => <li key={instruction}><span>{String(index + 1).padStart(2, "0")}</span>{instruction}</li>)}</ol></section>
        <DetailActions workout={workout} />
      </article>
    </main>
    <footer className="detail-footer"><Link href="/#top" className="fit-brand"><Image src="/logo.png" alt="" width={20} height={20} /><span>FITLOG</span></Link><span>© 2026 FitLog — Workout Library. Train hard, log honest.</span></footer>
  </div>;
}
