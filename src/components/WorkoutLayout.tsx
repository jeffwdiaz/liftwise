
import React from 'react';
import { Dumbbell } from 'lucide-react';

interface WorkoutLayoutProps {
  children: React.ReactNode;
  onStartNew?: () => void;
  showNewWorkoutButton?: boolean;
}

const WorkoutLayout: React.FC<WorkoutLayoutProps> = ({ 
  children, 
  onStartNew, 
  showNewWorkoutButton = false 
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Dumbbell className="h-6 w-6 text-swiss-red mr-2" />
          <h1 className="swiss-title text-xl">Liftwise</h1>
        </div>
        
        {showNewWorkoutButton && onStartNew && (
          <button 
            onClick={onStartNew}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            New Workout
          </button>
        )}
      </header>
      
      <main className="flex-1 p-4 swiss-container max-w-md mx-auto flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default WorkoutLayout;
