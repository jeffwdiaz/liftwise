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
    {
      id: 'shoulders-3',
      name: 'Front Raises',
      muscleGroup: 'shoulders',
      description: 'Raise dumbbells in front of you to shoulder height',
    },
    {
      id: 'shoulders-4',
      name: 'Shrugs',
      muscleGroup: 'shoulders',
      description: 'Shrug your shoulders while holding dumbbells',
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
    {
      id: 'legs-3',
      name: 'Romanian Deadlift',
      muscleGroup: 'legs',
      description: 'Hinge at hips to lower dumbbells along your legs',
    },
    {
      id: 'legs-4',
      name: 'Calf Raises',
      muscleGroup: 'legs',
      description: 'Stand on edge of step and raise heels up and down',
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
    {
      id: 'back-3',
      name: 'Bent Over Flyes',
      muscleGroup: 'back',
      description: 'Bend over and raise dumbbells to sides',
    },
    {
      id: 'back-4',
      name: 'Superman Hold',
      muscleGroup: 'back',
      description: 'Lie face down and lift arms and legs off ground',
    },
  ],
  arms: [
    {
      id: 'arms-1',
      name: 'Bicep Curls',
      muscleGroup: 'arms',
      description: 'Curl dumbbells upward toward your shoulders',
    },
    {
      id: 'arms-2',
      name: 'Tricep Extensions',
      muscleGroup: 'arms',
      description: 'Extend dumbbells overhead to work triceps',
    },
    {
      id: 'arms-3',
      name: 'Hammer Curls',
      muscleGroup: 'arms',
      description: 'Curl dumbbells with palms facing each other',
    },
    {
      id: 'arms-4',
      name: 'Tricep Kickbacks',
      muscleGroup: 'arms',
      description: 'Bend over and extend arms back behind you',
    },
  ],
  chest: [
    {
      id: 'chest-1',
      name: 'Bench Press',
      muscleGroup: 'chest',
      description: 'Press dumbbells upward while lying on a bench',
    },
    {
      id: 'chest-2',
      name: 'Dumbbell Flyes',
      muscleGroup: 'chest',
      description: 'Open arms wide then bring dumbbells together over chest',
    },
    {
      id: 'chest-3',
      name: 'Push-Ups',
      muscleGroup: 'chest',
      description: 'Classic push-up exercise for chest and arms',
    },
    {
      id: 'chest-4',
      name: 'Incline Press',
      muscleGroup: 'chest',
      description: 'Press dumbbells upward on an inclined bench',
    },
  ],
};

export default exercises;
