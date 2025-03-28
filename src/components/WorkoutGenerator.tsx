import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { WorkoutExercise } from '@/types';
import EnergyLevelSelector from './EnergyLevelSelector';
import ExerciseSelector from './ExerciseSelector';
import WorkoutTimer from './WorkoutTimer';
import { cn } from '@/lib/utils';

// Initialize the Gemini model
console.log('Initializing Gemini model...');
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('No API key found! Make sure VITE_GEMINI_API_KEY is set in your .env file');
}
console.log('API Key available:', !!apiKey); // Log if key exists without exposing it
const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
console.log('Gemini model initialized');

const WorkoutGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [energyLevel, setEnergyLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [equipment, setEquipment] = useState<string[]>(['dumbbells']);
  const [timeAvailable, setTimeAvailable] = useState(30);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [goals, setGoals] = useState<string[]>(['strength']);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('WorkoutGenerator mounted');
    if (!apiKey) {
      setError('API key not found. Please make sure VITE_GEMINI_API_KEY is set in your .env file');
    }
  }, []);

  const generateWorkout = async () => {
    console.log('generateWorkout called');
    try {
      setIsLoading(true);
      setError(null);

      const prompt = `Generate a personalized workout based on the following criteria:
      - Energy Level: ${energyLevel}
      - Available Equipment: ${equipment.join(', ')}
      - Time Available: ${timeAvailable} minutes
      - Experience Level: ${experienceLevel}
      - Goals: ${goals.join(', ')}
      
      Please suggest 4 exercises that would be appropriate for this workout. For each exercise, provide:
      1. The name of the exercise
      2. The muscle group it targets
      3. A brief description of how to perform it
      4. The recommended number of sets and reps
      
      Format the response as a JSON object with an "exercises" array containing objects with these properties:
      - name: string
      - muscleGroup: string (one of: shoulders, legs, back, arms, chest)
      - description: string
      - sets: number
      - reps: number`;

      console.log('Sending prompt to LLM:', prompt);
      const result = await model.generateContent(prompt);
      console.log('Got result from LLM');
      const response = await result.response;
      const text = response.text();
      console.log('LLM Response:', text);
      
      try {
        const parsedResponse = JSON.parse(text);
        console.log('Parsed Response:', parsedResponse);
        const workoutExercises = parsedResponse.exercises.map((exercise: any) => ({
          exercise: {
            id: `${exercise.muscleGroup}-${Math.random().toString(36).substr(2, 9)}`,
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            description: exercise.description,
          },
          sets: Array(exercise.sets).fill({
            reps: exercise.reps,
            weight: 0,
            completed: false,
          }),
        }));

        console.log('Final Workout Exercises:', workoutExercises);
        setWorkoutExercises(workoutExercises);
        setCurrentStep(2);
      } catch (parseError) {
        console.error('Error parsing LLM response:', parseError);
        setError('Failed to generate workout. Please try again.');
      }
    } catch (err) {
      console.error('Error generating workout:', err);
      setError('Failed to generate workout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExerciseSelect = (exercise: WorkoutExercise) => {
    setWorkoutExercises(prev => 
      prev.map(ex => 
        ex.exercise.id === exercise.exercise.id ? exercise : ex
      )
    );
    setCurrentStep(3);
  };

  const handleSetComplete = (exerciseId: string, setIndex: number) => {
    setWorkoutExercises(prev =>
      prev.map(exercise => {
        if (exercise.exercise.id === exerciseId) {
          const newSets = [...exercise.sets];
          newSets[setIndex] = { ...newSets[setIndex], completed: true };
          return { ...exercise, sets: newSets };
        }
        return exercise;
      })
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="swiss-title text-3xl">Workout Generator</h1>
        <p className="text-muted-foreground">
          Let's create a personalized workout based on your energy level and preferences.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {currentStep === 1 && (
        <EnergyLevelSelector
          energyLevel={energyLevel}
          onSelect={setEnergyLevel}
          onGenerate={generateWorkout}
          isLoading={isLoading}
        />
      )}

      {currentStep === 2 && (
        <ExerciseSelector
          exercises={workoutExercises}
          onSelect={handleExerciseSelect}
        />
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <WorkoutTimer duration={timeAvailable} />
          <div className="space-y-4">
            {workoutExercises.map((exercise) => (
              <div key={exercise.exercise.id} className="swiss-card p-4">
                <h3 className="font-medium text-lg mb-2">{exercise.exercise.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {exercise.exercise.description}
                </p>
                <div className="space-y-2">
                  {exercise.sets.map((set, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between p-2 rounded",
                        set.completed ? "bg-green-100" : "bg-gray-100"
                      )}
                    >
                      <span>Set {index + 1}: {set.reps} reps</span>
                      {!set.completed && (
                        <button
                          onClick={() => handleSetComplete(exercise.exercise.id, index)}
                          className="px-3 py-1 bg-swiss-red text-white rounded-md hover:bg-swiss-red/90 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutGenerator; 