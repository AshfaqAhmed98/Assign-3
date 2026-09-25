export type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
};

export const workoutsApi = "https://api.abcz.workers.dev/api/fitlog";

const workoutsFetchOptions = {
  next: { revalidate: 3600 },
};

export async function getWorkouts(): Promise<Workout[]> {
  const response = await fetch(workoutsApi, workoutsFetchOptions);
  const data: Workout[] | { value: Workout[] } = await response.json();
  const workouts = Array.isArray(data) ? data : data.value;
  return Array.isArray(workouts) ? workouts : [];
}

export async function getWorkoutById(id: string): Promise<Workout | undefined> {
  const workouts = await getWorkouts();
  return workouts.find((workout) => String(workout.id) === id);
}
