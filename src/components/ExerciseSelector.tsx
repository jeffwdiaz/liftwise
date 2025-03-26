
import React from 'react';
import { WorkoutExercise } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface ExerciseSelectorProps {
  exercises: WorkoutExercise[];
  onSelect: (exercise: WorkoutExercise) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({ exercises, onSelect }) => {
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
          These exercises target your {exercises[0]?.exercise.muscleGroup} today.
        </p>
      </div>

      <div className="space-y-3">
        {exercises.map((exerciseWithSets) => (
          <button
            key={exerciseWithSets.exercise.id}
            onClick={() => onSelect(exerciseWithSets)}
            className="swiss-card w-full text-left flex items-center justify-between group hover:border-swiss-red"
          >
            <div>
              <h3 className="font-medium text-lg">{exerciseWithSets.exercise.name}</h3>
              <p className="text-sm text-muted-foreground">{exerciseWithSets.sets.length} sets</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-swiss-red transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExerciseSelector;
