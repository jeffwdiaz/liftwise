import React from 'react';
import { useWorkoutState } from '@/hooks/useWorkoutState';
import WorkoutLayout from '@/components/WorkoutLayout';
import WorkoutMethodSelector from '@/components/WorkoutMethodSelector';
import EnergyLevelSelector from '@/components/EnergyLevelSelector';
import EquipmentSelector from '@/components/EquipmentSelector';
import ExerciseSelector from '@/components/ExerciseSelector';
import RepCounter from '@/components/RepCounter';
import WorkoutComplete from '@/components/WorkoutComplete';
import AiWorkoutGenerator from '@/components/AiWorkoutGenerator';

const Index = () => {
  const {
    state,
    isLoading,
    handleEnergySelect,
    handleEquipmentSelect,
    handleMethodSelect,
    handleExerciseSelect,
    handleUpdateReps,
    handleCompleteSet,
    handleNext,
    handleStartNew,
    handleAiWorkoutGenerated
  } = useWorkoutState();

  // Render current screen based on state
  const renderScreen = () => {
    switch (state.screen) {
      case 'energy':
        return <EnergyLevelSelector onSelect={handleEnergySelect} />;
      
      case 'equipment':
        return <EquipmentSelector onSelect={handleEquipmentSelect} />;
      
      case 'method':
        return <WorkoutMethodSelector onMethodSelect={handleMethodSelect} />;
      
      case 'aiGenerator':
        if ('energyLevel' in state && 'equipment' in state) {
          return (
            <AiWorkoutGenerator
              energyLevel={state.energyLevel}
              equipment={state.equipment}
              onWorkoutGenerated={handleAiWorkoutGenerated}
            />
          );
        }
        return null;
      
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
