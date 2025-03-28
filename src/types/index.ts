export type MuscleGroup = 'shoulders' | 'legs' | 'back' | 'arms' | 'chest';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  description: string;
}

export interface Set {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exercise: Exercise;
  sets: Set[];
}

export interface Workout {
  id: string;
  date: string;
  energyLevel: number;
  exercises: WorkoutExercise[];
  completed: boolean;
  aiGenerated?: boolean;
  reasoning?: string;
  equipment?: string;
}

export interface WorkoutHistory {
  workouts: Workout[];
}

export interface AIWorkoutPrompt {
  fitnessGoal: string;
  experience: string;
  limitations: string;
}
