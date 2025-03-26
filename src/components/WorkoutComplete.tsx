
import React from 'react';
import { Workout } from '@/types';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface WorkoutCompleteProps {
  workout: Workout;
  onStartNew: () => void;
}

const WorkoutComplete: React.FC<WorkoutCompleteProps> = ({ workout, onStartNew }) => {
  // Calculate total volume (sets × reps)
  const totalSets = workout.exercises.reduce(
    (total, ex) => total + ex.sets.length, 
    0
  );
  
  const totalReps = workout.exercises.reduce(
    (total, ex) => total + ex.sets.reduce((setTotal, set) => setTotal + set.reps, 0), 
    0
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-center flex-col space-y-4 pt-8">
        <div className="h-24 w-24 rounded-full bg-green-600 flex items-center justify-center">
          <Check className="h-12 w-12 text-white" />
        </div>
        <h1 className="swiss-title text-3xl">Workout Complete!</h1>
        <p className="text-muted-foreground text-center">
          Great job! You've finished your workout.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 py-4">
        <div className="swiss-card text-center">
          <p className="text-muted-foreground text-sm">Energy Level</p>
          <p className="swiss-title text-3xl">{workout.energyLevel}/5</p>
        </div>
        <div className="swiss-card text-center">
          <p className="text-muted-foreground text-sm">Muscle Group</p>
          <p className="swiss-title text-3xl capitalize">
            {workout.exercises[0]?.exercise.muscleGroup || "N/A"}
          </p>
        </div>
        <div className="swiss-card text-center">
          <p className="text-muted-foreground text-sm">Total Sets</p>
          <p className="swiss-title text-3xl">{totalSets}</p>
        </div>
        <div className="swiss-card text-center">
          <p className="text-muted-foreground text-sm">Total Reps</p>
          <p className="swiss-title text-3xl">{totalReps}</p>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={onStartNew} className="swiss-button w-full">
          Start New Workout
        </Button>
      </div>
    </div>
  );
};

export default WorkoutComplete;
