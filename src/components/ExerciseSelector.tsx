import React from 'react';
import { WorkoutExercise } from '@/types';
import { cn } from '@/lib/utils';

interface ExerciseSelectorProps {
  exercises: WorkoutExercise[];
  onSelect: (exercise: WorkoutExercise) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ exercises, onSelect }) => {
  // Take only the first 4 exercises
  const displayExercises = exercises.slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="swiss-title text-2xl">Choose an exercise</h2>
          <span className="text-sm bg-swiss-red text-white px-2 py-1">
            {exercises[0]?.exercise.muscleGroup}
          </span>
        </div>
        <p className="text-muted-foreground">
          Select one of these exercises to begin your {exercises[0]?.exercise.muscleGroup} workout.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {displayExercises.map((exerciseWithSets) => (
          <button
            key={exerciseWithSets.exercise.id}
            onClick={() => onSelect(exerciseWithSets)}
            className={cn(
              "swiss-card aspect-square flex flex-col items-center justify-center p-4 text-center",
              "hover:border-swiss-red transition-all duration-200"
            )}
          >
            <h3 className="font-medium text-lg mb-2">{exerciseWithSets.exercise.name}</h3>
            <p className="text-sm text-muted-foreground">{exerciseWithSets.sets.length} sets</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExerciseSelector;
