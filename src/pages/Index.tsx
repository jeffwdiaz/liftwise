
import React from 'react';
import { useWorkoutState } from '@/hooks/useWorkoutState';
import WorkoutLayout from '@/components/WorkoutLayout';
import WorkoutMethodSelector from '@/components/WorkoutMethodSelector';
import EnergyLevelSelector from '@/components/EnergyLevelSelector';
import ExerciseSelector from '@/components/ExerciseSelector';
import RepCounter from '@/components/RepCounter';
import WorkoutComplete from '@/components/WorkoutComplete';
import GeminiApiKeySetup from '@/components/GeminiApiKeySetup';
import AiWorkoutForm from '@/components/AiWorkoutForm';

const Index = () => {
  const {
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
  } = useWorkoutState();

  // Render current screen based on state
  const renderScreen = () => {
    switch (state.screen) {
      case 'energy':
        return <EnergyLevelSelector onSelect={handleEnergySelect} />;
      
      case 'method':
        return <WorkoutMethodSelector onMethodSelect={handleMethodSelect} />;
      
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

  // Determine if we should show the "New Workout" button
  const showNewWorkoutButton = state.screen !== 'energy';

  return (
    <WorkoutLayout onStartNew={handleStartNew} showNewWorkoutButton={showNewWorkoutButton}>
      {renderScreen()}
    </WorkoutLayout>
  );
};

export default Index;
