
import { Exercise, MuscleGroup } from '@/types';

const exercises: Record<MuscleGroup, Exercise[]> = {
  shoulders: [
    {
      id: 'shoulders-1',
      name: 'Dumbbell Shoulder Press',
      muscleGroup: 'shoulders',
      description: 'Press dumbbells overhead while seated or standing',
    },
    {
      id: 'shoulders-2',
      name: 'Lateral Raises',
      muscleGroup: 'shoulders',
      description: 'Raise dumbbells to the sides to shoulder height',
    },
  ],
  legs: [
    {
      id: 'legs-1',
      name: 'Dumbbell Squat',
      muscleGroup: 'legs',
      description: 'Squat while holding dumbbells at your sides',
    },
    {
      id: 'legs-2',
      name: 'Dumbbell Lunges',
      muscleGroup: 'legs',
      description: 'Step forward into a lunge while holding dumbbells',
    },
  ],
  back: [
    {
      id: 'back-1',
      name: 'Dumbbell Rows',
      muscleGroup: 'back',
      description: 'Bend over and row dumbbells to your sides',
    },
    {
      id: 'back-2',
      name: 'Dumbbell Pullover',
      muscleGroup: 'back',
      description: 'Lie on bench and pull dumbbell over your head',
    },
  ],
  arms: [
    {
      id: 'arms-1',
      name: 'Dumbbell Bicep Curls',
      muscleGroup: 'arms',
      description: 'Curl dumbbells upward toward your shoulders',
    },
    {
      id: 'arms-2',
      name: 'Dumbbell Tricep Extensions',
      muscleGroup: 'arms',
      description: 'Extend dumbbells overhead to work triceps',
    },
  ],
  chest: [
    {
      id: 'chest-1',
      name: 'Dumbbell Bench Press',
      muscleGroup: 'chest',
      description: 'Press dumbbells upward while lying on a bench',
    },
    {
      id: 'chest-2',
      name: 'Dumbbell Flyes',
      muscleGroup: 'chest',
      description: 'Open arms wide then bring dumbbells together over chest',
    },
  ],
};

export default exercises;
