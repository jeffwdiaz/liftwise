
import React from 'react';
import { Dumbbell, Sparkles } from 'lucide-react';

interface WorkoutMethodSelectorProps {
  onMethodSelect: (useAi: boolean) => void;
}

const WorkoutMethodSelector: React.FC<WorkoutMethodSelectorProps> = ({ onMethodSelect }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="swiss-title text-2xl">Choose workout method</h2>
        <p className="text-muted-foreground">How would you like to create your workout today?</p>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => onMethodSelect(false)}
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
          onClick={() => onMethodSelect(true)}
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
};

export default WorkoutMethodSelector;
