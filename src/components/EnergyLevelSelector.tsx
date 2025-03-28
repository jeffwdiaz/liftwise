import React from 'react';
import { cn } from '@/lib/utils';

interface EnergyLevelSelectorProps {
  energyLevel: 'low' | 'medium' | 'high';
  onSelect: (level: 'low' | 'medium' | 'high') => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const EnergyLevelSelector: React.FC<EnergyLevelSelectorProps> = ({
  energyLevel,
  onSelect,
  onGenerate,
  isLoading,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="swiss-title text-2xl">How's your energy level?</h2>
        <p className="text-muted-foreground">
          Select your current energy level to get personalized workout suggestions.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(['low', 'medium', 'high'] as const).map((level) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={cn(
              "swiss-card aspect-square flex flex-col items-center justify-center p-4 text-center",
              energyLevel === level && "border-swiss-red",
              "hover:border-swiss-red transition-all duration-200"
            )}
          >
            <span className="text-4xl mb-2">
              {level === 'low' && '😴'}
              {level === 'medium' && '😊'}
              {level === 'high' && '⚡'}
            </span>
            <span className="font-medium capitalize">{level}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className={cn(
          "w-full py-3 px-4 bg-swiss-red text-white rounded-md font-medium",
          "hover:bg-swiss-red/90 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isLoading ? 'Generating...' : 'Generate Workout'}
      </button>
    </div>
  );
};

export default EnergyLevelSelector;
