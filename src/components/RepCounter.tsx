
import React from 'react';
import { ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { Set } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RepCounterProps {
  set: Set;
  setIndex: number;
  onUpdateReps: (setIndex: number, newReps: number) => void;
  onCompleteSet: (setIndex: number) => void;
  onNext: () => void;
  isLastSet: boolean;
  exerciseName: string;
}

const RepCounter: React.FC<RepCounterProps> = ({
  set,
  setIndex,
  onUpdateReps,
  onCompleteSet,
  onNext,
  isLastSet,
  exerciseName,
}) => {
  const handleIncrement = () => {
    onUpdateReps(setIndex, set.reps + 1);
  };

  const handleDecrement = () => {
    if (set.reps > 1) {
      onUpdateReps(setIndex, set.reps - 1);
    }
  };

  const handleComplete = () => {
    onCompleteSet(setIndex);
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="swiss-title text-2xl">{exerciseName}</h2>
          <span className="text-sm bg-swiss-red text-white px-2 py-1">
            Set {setIndex + 1}
          </span>
        </div>
        <p className="text-muted-foreground">Complete your reps and press Next when done.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center pb-16">
        <button
          onClick={handleIncrement}
          className="p-4 transform active:scale-95 transition-transform"
          aria-label="Increase reps"
        >
          <ArrowUp className="h-10 w-10 text-swiss-red" />
        </button>
        
        <div className="relative my-8">
          <span className="text-7xl font-bold">{set.reps}</span>
          <span className="absolute -right-8 top-2 text-lg font-medium text-muted-foreground">reps</span>
        </div>
        
        <button
          onClick={handleDecrement}
          className="p-4 transform active:scale-95 transition-transform disabled:opacity-30"
          disabled={set.reps <= 1}
          aria-label="Decrease reps"
        >
          <ArrowDown className="h-10 w-10 text-swiss-red" />
        </button>
      </div>

      <div className="space-y-3">
        <Button
          onClick={handleComplete}
          className={cn(
            "w-full py-6 flex items-center justify-center space-x-2 font-medium",
            set.completed 
              ? "bg-green-600 hover:bg-green-700" 
              : "swiss-button"
          )}
        >
          {set.completed && <CheckCircle className="h-5 w-5 mr-2" />}
          <span>{set.completed ? "Completed" : "Complete Set"}</span>
        </Button>

        <Button
          onClick={onNext}
          disabled={!set.completed}
          className="w-full bg-black text-white hover:bg-opacity-80 rounded-none py-6"
        >
          {isLastSet ? "Finish Exercise" : "Next Set"}
        </Button>
      </div>
    </div>
  );
};

export default RepCounter;
