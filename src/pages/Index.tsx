
import React, { useState, useEffect } from 'react';
import { Workout, WorkoutExercise, Set, AIWorkoutPrompt } from '@/types';
import EnergyLevelSelector from '@/components/EnergyLevelSelector';
import ExerciseSelector from '@/components/ExerciseSelector';
import RepCounter from '@/components/RepCounter';
import WorkoutComplete from '@/components/WorkoutComplete';
import GeminiApiKeySetup from '@/components/GeminiApiKeySetup';
import AiWorkoutForm from '@/components/AiWorkoutForm';
import { generateWorkout, saveWorkout } from '@/utils/workoutUtils';
import { getAiWorkoutRecommendation, hasGeminiApiKey } from '@/utils/aiUtils';
import { Dumbbell, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Workout state machine
type WorkoutState = 
  | { screen: 'energy'; }
  | { screen: 'method'; energyLevel: number; }
  | { screen: 'aiSetup'; energyLevel: number; }
  | { screen: 'aiForm'; energyLevel: number; }
  | { screen: 'exercises'; workout: Workout; }
  | { screen: 'counter'; workout: Workout; exerciseIndex: number; setIndex: number; }
  | { screen: 'complete'; workout: Workout; };

const Index = () => {
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
        setState({ ...state, screen: 'aiForm' });
      } else {
        setState({ ...state, screen: 'aiSetup' });
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

  // Render current screen based on state
  const renderScreen = () => {
    switch (state.screen) {
      case 'energy':
        return <EnergyLevelSelector onSelect={handleEnergySelect} />;
      
      case 'method':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h2 className="swiss-title text-2xl">Choose workout method</h2>
              <p className="text-muted-foreground">How would you like to create your workout today?</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleMethodSelect(false)}
                className="swiss-card w-full text-left flex items-center justify-between group hover:border-swiss-red p-4"
              >
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-6 w-6 text-swiss-red" />
                  <div>
                    <h3 className="font-medium text-lg">Standard Workout</h3>
                    <p className="text-sm text-muted-foreground">Based on your most neglected muscle groups</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => handleMethodSelect(true)}
                className="swiss-card w-full text-left flex items-center justify-between group hover:border-swiss-red p-4"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-swiss-red" />
                  <div>
                    <h3 className="font-medium text-lg">AI Recommendation</h3>
                    <p className="text-sm text-muted-foreground">Personalized workout using Gemini AI</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );
      
      case 'aiSetup':
        return <GeminiApiKeySetup onApiKeySet={handleApiKeySet} />;
      
      case 'aiForm':
        return <AiWorkoutForm onSubmit={handleAiFormSubmit} isLoading={isLoading} />;
      
      case 'exercises':
        return (
          <ExerciseSelector 
            exercises={state.workout.exercises} 
            onSelect={handleExerciseSelect} 
          />
        );
      
      case 'counter':
        const exercise = state.workout.exercises[state.exerciseIndex];
        const set = exercise.sets[state.setIndex];
        const isLastSet = state.setIndex === exercise.sets.length - 1;
        
        return (
          <RepCounter 
            set={set}
            setIndex={state.setIndex}
            onUpdateReps={handleUpdateReps}
            onCompleteSet={handleCompleteSet}
            onNext={handleNext}
            isLastSet={isLastSet}
            exerciseName={exercise.exercise.name}
          />
        );
      
      case 'complete':
        return (
          <WorkoutComplete 
            workout={state.workout} 
            onStartNew={handleStartNew} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Dumbbell className="h-6 w-6 text-swiss-red mr-2" />
          <h1 className="swiss-title text-xl">Liftwise</h1>
        </div>
        
        {state.screen !== 'energy' && (
          <button 
            onClick={handleStartNew}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            New Workout
          </button>
        )}
      </header>
      
      <main className="flex-1 p-4 swiss-container max-w-md mx-auto flex flex-col">
        {renderScreen()}
      </main>
    </div>
  );
};

export default Index;
