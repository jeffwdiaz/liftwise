import { useState } from 'react';
import { Workout, WorkoutExercise, Set, AIWorkoutPrompt } from '@/types';
import { generateWorkout, saveWorkout } from '@/utils/workoutUtils';
import { getAiWorkoutRecommendation, hasGeminiApiKey } from '@/utils/aiUtils';
import { toast } from 'sonner';

// Workout state machine
export type WorkoutState = 
  | { screen: 'energy'; }
  | { screen: 'equipment'; energyLevel: number; }
  | { screen: 'method'; energyLevel: number; equipment: string; }
  | { screen: 'aiGenerator'; energyLevel: number; equipment: string; }
  | { screen: 'exercises'; workout: Workout; }
  | { screen: 'counter'; workout: Workout; exerciseIndex: number; setIndex: number; }
  | { screen: 'complete'; workout: Workout; };

export const useWorkoutState = () => {
  const [state, setState] = useState<WorkoutState>({ screen: 'energy' });
  const [isLoading, setIsLoading] = useState(false);

  // Handle selecting energy level
  const handleEnergySelect = (energyLevel: number) => {
    setState({ screen: 'equipment', energyLevel });
  };

  // Handle selecting equipment
  const handleEquipmentSelect = (equipment: string) => {
    if ('energyLevel' in state) {
      setState({ screen: 'method', energyLevel: state.energyLevel, equipment });
    }
  };

  // Handle selecting workout generation method
  const handleMethodSelect = (useAi: boolean) => {
    if ('energyLevel' in state && 'equipment' in state) {
      if (useAi) {
        setState({ screen: 'aiGenerator', energyLevel: state.energyLevel, equipment: state.equipment });
      } else {
        const workout = generateWorkout(state.energyLevel, state.equipment);
        setState({ screen: 'exercises', workout });
      }
    }
  };

  // Handle AI workout generation
  const handleAiWorkoutGenerated = (aiWorkout: any) => {
    if ('energyLevel' in state && 'equipment' in state) {
      const workout: Workout = {
        id: `workout-${Date.now()}`,
        date: new Date().toISOString(),
        energyLevel: state.energyLevel,
        exercises: aiWorkout.exercises.map((ex: any) => ({
          exercise: {
            id: ex.name.toLowerCase().replace(/\s+/g, '-'),
            name: ex.name,
            muscleGroup: 'chest', // This will be determined by the AI
            description: `${ex.sets} sets of ${ex.reps} reps with ${ex.rest} rest`
          },
          sets: Array(ex.sets).fill(null).map(() => ({ reps: ex.reps, completed: false }))
        })),
        completed: false,
        equipment: state.equipment,
        aiGenerated: true
      };
      setState({ screen: 'exercises', workout });
    }
  };

  // Handle selecting an exercise
  const handleExerciseSelect = (exercise: WorkoutExercise) => {
    if ('workout' in state) {
      const exerciseIndex = state.workout.exercises.findIndex(
        (e) => e.exercise.id === exercise.exercise.id
      );
      
      setState({ 
        screen: 'counter', 
        workout: state.workout,
        exerciseIndex,
        setIndex: 0
      });
    }
  };

  // Handle updating reps for a set
  const handleUpdateReps = (setIndex: number, newReps: number) => {
    if (state.screen === 'counter') {
      const updatedWorkout = { ...state.workout };
      updatedWorkout.exercises[state.exerciseIndex].sets[setIndex].reps = newReps;
      
      setState({
        ...state,
        workout: updatedWorkout
      });
    }
  };

  // Handle completing a set
  const handleCompleteSet = (setIndex: number) => {
    if (state.screen === 'counter') {
      const updatedWorkout = { ...state.workout };
      updatedWorkout.exercises[state.exerciseIndex].sets[setIndex].completed = true;
      
      setState({
        ...state,
        workout: updatedWorkout
      });
    }
  };

  // Handle moving to next set or exercise
  const handleNext = () => {
    if (state.screen === 'counter') {
      const { workout, exerciseIndex, setIndex } = state;
      const currentExercise = workout.exercises[exerciseIndex];
      
      // If there are more sets in this exercise
      if (setIndex < currentExercise.sets.length - 1) {
        setState({
          ...state,
          setIndex: setIndex + 1
        });
      } 
      // If there are more exercises
      else if (exerciseIndex < workout.exercises.length - 1) {
        setState({
          screen: 'counter',
          workout,
          exerciseIndex: exerciseIndex + 1,
          setIndex: 0
        });
      } 
      // Workout complete
      else {
        const completedWorkout = { ...workout, completed: true };
        saveWorkout(completedWorkout);
        setState({
          screen: 'complete',
          workout: completedWorkout
        });
      }
    }
  };

  // Start a new workout
  const handleStartNew = () => {
    setState({ screen: 'energy' });
  };

  return {
    state,
    isLoading,
    handleEnergySelect,
    handleEquipmentSelect,
    handleMethodSelect,
    handleAiWorkoutGenerated,
    handleExerciseSelect,
    handleUpdateReps,
    handleCompleteSet,
    handleNext,
    handleStartNew
  };
};
