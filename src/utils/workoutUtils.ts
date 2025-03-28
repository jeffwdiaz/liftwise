import { Exercise, MuscleGroup, Workout, WorkoutExercise, WorkoutHistory } from '@/types';
import exercises from '@/data/exercises';

// Local storage key for workout history
const WORKOUT_HISTORY_KEY = 'workout_history';

// Get workout history from localStorage
export const getWorkoutHistory = (): WorkoutHistory => {
  const storedHistory = localStorage.getItem(WORKOUT_HISTORY_KEY);
  if (storedHistory) {
    return JSON.parse(storedHistory);
  }
  return { workouts: [] };
};

// Save workout history to localStorage
export const saveWorkoutHistory = (history: WorkoutHistory): void => {
  localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history));
};

// Save a completed workout to history
export const saveWorkout = (workout: Workout): void => {
  const history = getWorkoutHistory();
  history.workouts.push(workout);
  saveWorkoutHistory(history);
};

// Get the most neglected muscle groups based on workout history
export const getMostNeglectedMuscleGroups = (): MuscleGroup[] => {
  const history = getWorkoutHistory();
  const muscleGroups: MuscleGroup[] = ['shoulders', 'legs', 'back', 'arms', 'chest'];
  
  // If no workout history, return all muscle groups in default order
  if (history.workouts.length === 0) {
    return muscleGroups;
  }

  // Create a map to track when each muscle group was last worked
  const lastWorkedMap: Record<MuscleGroup, Date> = {} as Record<MuscleGroup, Date>;
  
  // Initialize with a very old date
  muscleGroups.forEach((group) => {
    lastWorkedMap[group] = new Date(0); // January 1, 1970
  });
  
  // Update with the latest workout date for each muscle group
  history.workouts.forEach((workout) => {
    const workoutDate = new Date(workout.date);
    
    workout.exercises.forEach((exercise) => {
      const muscleGroup = exercise.exercise.muscleGroup;
      if (workoutDate > lastWorkedMap[muscleGroup]) {
        lastWorkedMap[muscleGroup] = workoutDate;
      }
    });
  });
  
  // Sort muscle groups by least recently worked first
  return muscleGroups.sort((a, b) => lastWorkedMap[a].getTime() - lastWorkedMap[b].getTime());
};

// Calculate baseline reps and sets for an exercise
export const calculateBaselineVolume = (muscleGroup: MuscleGroup): { reps: number, sets: number } => {
  // This is a simple implementation - in a real app you might analyze past performance
  // Default values
  const defaultVolume: Record<MuscleGroup, { reps: number, sets: number }> = {
    shoulders: { reps: 10, sets: 3 },
    legs: { reps: 12, sets: 3 },
    back: { reps: 10, sets: 3 },
    arms: { reps: 12, sets: 3 },
    chest: { reps: 10, sets: 3 },
  };
  
  return defaultVolume[muscleGroup];
};

// Adjust volume based on energy level (1-5)
export const adjustVolumeForEnergyLevel = (
  baseReps: number, 
  baseSets: number, 
  energyLevel: number
): { reps: number, sets: number } => {
  let multiplier = 1.0;
  
  // Adjust multiplier based on energy level
  switch (energyLevel) {
    case 1: // Very low energy
      multiplier = 0.6;
      break;
    case 2: // Low energy
      multiplier = 0.8;
      break;
    case 3: // Normal energy
      multiplier = 1.0;
      break;
    case 4: // High energy
      multiplier = 1.15;
      break;
    case 5: // Very high energy
      multiplier = 1.25;
      break;
    default:
      multiplier = 1.0;
  }
  
  // Apply multiplier and round to nearest integer
  const adjustedReps = Math.max(1, Math.round(baseReps * multiplier));
  const adjustedSets = Math.max(1, Math.round(baseSets * multiplier));
  
  return { reps: adjustedReps, sets: adjustedSets };
};

// Generate a workout based on energy level and equipment
export const generateWorkout = (energyLevel: number, equipment?: string): Workout => {
  // Get neglected muscle groups
  const neglectedGroups = getMostNeglectedMuscleGroups();
  
  // Take the most neglected muscle group
  const targetGroup = neglectedGroups[0];
  
  // Get exercises for this muscle group
  let muscleExercises = exercises[targetGroup];
  
  // Filter exercises based on equipment
  if (equipment) {
    muscleExercises = muscleExercises.filter(exercise => {
      if (equipment === 'Dumbbells') {
        return exercise.name.toLowerCase().includes('dumbbell') || 
               exercise.name.toLowerCase().includes('dumbbells') ||
               !exercise.name.toLowerCase().includes('barbell') &&
               !exercise.name.toLowerCase().includes('machine') &&
               !exercise.name.toLowerCase().includes('cable');
      } else if (equipment === 'No Equipment') {
        return !exercise.name.toLowerCase().includes('dumbbell') &&
               !exercise.name.toLowerCase().includes('dumbbells') &&
               !exercise.name.toLowerCase().includes('barbell') &&
               !exercise.name.toLowerCase().includes('machine') &&
               !exercise.name.toLowerCase().includes('cable');
      }
      return true;
    });
  }
  
  // Get baseline volume
  const { reps: baseReps, sets: baseSets } = calculateBaselineVolume(targetGroup);
  
  // Adjust for energy level
  const { reps, sets } = adjustVolumeForEnergyLevel(baseReps, baseSets, energyLevel);
  
  // Create sets
  const createSets = (count: number, reps: number) => 
    Array(count).fill(null).map(() => ({ reps, completed: false }));
  
  // Create workout exercises with sets
  const workoutExercises: WorkoutExercise[] = muscleExercises.map((exercise) => ({
    exercise,
    sets: createSets(sets, reps)
  }));
  
  // Create full workout
  const workout: Workout = {
    id: `workout-${Date.now()}`,
    date: new Date().toISOString(),
    energyLevel,
    exercises: workoutExercises,
    completed: false,
    equipment
  };
  
  return workout;
};
