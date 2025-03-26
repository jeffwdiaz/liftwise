
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnergyLevelSelectorProps {
  onSelect: (level: number) => void;
}

const EnergyLevelSelector: React.FC<EnergyLevelSelectorProps> = ({ onSelect }) => {
  const [selectedLevel, setSelectedLevel] = React.useState<number | null>(null);

  const handleSelect = (level: number) => {
    setSelectedLevel(level);
  };

  const handleConfirm = () => {
    if (selectedLevel !== null) {
      onSelect(selectedLevel);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="swiss-title text-2xl">How's your energy today?</h2>
        <p className="text-muted-foreground">This will help customize your workout.</p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => handleSelect(level)}
            className={cn(
              "aspect-square flex items-center justify-center text-xl font-bold rounded-none border-2 transition-all duration-200",
              selectedLevel === level
                ? "border-swiss-red bg-swiss-red text-white"
                : "border-border hover:border-swiss-red"
            )}
          >
            {level}
          </button>
        ))}
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={handleConfirm}
          disabled={selectedLevel === null}
          className="swiss-button w-full"
        >
          Generate Workout
        </Button>
      </div>
    </div>
  );
};

export default EnergyLevelSelector;
