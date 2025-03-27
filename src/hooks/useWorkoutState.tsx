
import { useState } from 'react';
import { Workout, WorkoutExercise, Set, AIWorkoutPrompt } from '@/types';
import { generateWorkout, saveWorkout } from '@/utils/workoutUtils';
import { getAiWorkoutRecommendation, hasGeminiApiKey } from '@/utils/aiUtils';
import { toast } from 'sonner';

// Workout state machine
export type WorkoutState = 
  | { screen: 'energy'; }
  | { screen: 'method'; energyLevel: number; }
  | { screen: 'aiSetup'; energyLevel: number; }
  | { screen: 'aiForm'; energyLevel: number; }
  | { screen: 'exercises'; workout: Workout; }
  | { screen: 'counter'; workout: Workout; exerciseIndex: number; setIndex: number; }
  | { screen: 'complete'; workout: Workout; };

export const useWorkoutState = () => {
  const [state, setState] = useState<WorkoutState>({ screen: 'energy' });
  const [isLoading, setIsLoading] = useState(false);

  // Handle selecting energy level
  const handleEnergySelect = (energyLevel: number) => {
    setState({ screen: 'method', energyLevel });
  };

  // Handle selecting workout generation method
  const handleMethodSelect = (useAi: boolean) => {
    if (useAi) {
      // Check if we have the API key
      if (hasGeminiApiKey()) {
        if ('energyLevel' in state) {
          setState({ screen: 'aiForm', energyLevel: state.energyLevel });
        }
      } else {
        if ('energyLevel' in state) {
          setState({ screen: 'aiSetup', energyLevel: state.energyLevel });
        }
      }
    } else {
      // Use traditional method
      if ('energyLevel' in state) {
        const workout = generateWorkout(state.energyLevel);
        setState({ screen: 'exercises', workout });
      }
    }
  };

  // Handle API key setup completion
  const handleApiKeySet = () => {
    if ('energyLevel' in state) {
      setState({ screen: 'aiForm', energyLevel: state.energyLevel });
    }
  };

  // Handle AI form submission
  const handleAiFormSubmit = async (promptData: AIWorkoutPrompt) => {
    if ('energyLevel' in state) {
      setIsLoading(true);
      try {
        const aiWorkout = await getAiWorkoutRecommendation(promptData, state.energyLevel);
        setState({ screen: 'exercises', workout: aiWorkout });
        toast.success("AI workout generated successfully!");
      } catch (error) {
        console.error("Error generating AI workout:", error);
        toast.error("Failed to generate AI workout. Using standard workout instead.");
        // Fallback to regular workout generation
        const workout = generateWorkout(state.energyLevel);
        setState({ screen: 'exercises', workout });
      } finally {
        setIsLoading(false);
      }
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
    handleMethodSelect,
    handleApiKeySet,
    handleAiFormSubmit,
    handleExerciseSelect,
    handleUpdateReps,
    handleCompleteSet,
    handleNext,
    handleStartNew
  };
};
