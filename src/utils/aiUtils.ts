
import { AIWorkoutPrompt, Workout, MuscleGroup, WorkoutExercise } from "@/types";
import exercises from "@/data/exercises";
import { v4 as uuidv4 } from "uuid";
import { getWorkoutHistory } from "./workoutUtils";

// Local storage for API key functions
const getGeminiApiKey = (): string | null => {
  return localStorage.getItem("gemini_api_key");
};

export const saveGeminiApiKey = (apiKey: string): void => {
  localStorage.setItem("gemini_api_key", apiKey);
};

export const hasGeminiApiKey = (): boolean => {
  return !!getGeminiApiKey();
};

// Get a summary of recent exercise history for a muscle group
const getRecentMuscleGroupActivity = (muscleGroup: MuscleGroup): string => {
  const history = getWorkoutHistory();
  
  // Filter workouts for this muscle group
  const relevantWorkouts = history.workouts
    .filter(workout => workout.exercises.some(ex => ex.exercise.muscleGroup === muscleGroup))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  if (relevantWorkouts.length === 0) {
    return `No recent workouts for ${muscleGroup}.`;
  }
  
  const lastWorkout = relevantWorkouts[0];
  const daysSinceLastWorkout = Math.floor(
    (new Date().getTime() - new Date(lastWorkout.date).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Calculate average reps and sets from last workout
  const lastWorkoutExercises = lastWorkout.exercises
    .filter(ex => ex.exercise.muscleGroup === muscleGroup);
    
  const avgSets = lastWorkoutExercises.reduce((sum, ex) => sum + ex.sets.length, 0) / lastWorkoutExercises.length;
  const avgReps = lastWorkoutExercises.reduce((sum, ex) => {
    const totalReps = ex.sets.reduce((s, set) => s + set.reps, 0);
    return sum + (totalReps / ex.sets.length);
  }, 0) / lastWorkoutExercises.length;
  
  return `Last worked ${daysSinceLastWorkout} days ago with average ${avgSets.toFixed(1)} sets and ${avgReps.toFixed(1)} reps per exercise.`;
};

// Generate a prompt for Gemini based on user preferences and history
const generatePrompt = (prompt: AIWorkoutPrompt, energyLevel: number): string => {
  // Get history summaries for each muscle group
  const muscleGroups: MuscleGroup[] = ['shoulders', 'legs', 'back', 'arms', 'chest'];
  const historyData = muscleGroups.map(group => {
    return `- ${group}: ${getRecentMuscleGroupActivity(group)}`;
  }).join('\n');
  
  return `Create a personalized workout plan with the following details:
- Fitness goal: ${prompt.fitnessGoal}
- Experience level: ${prompt.experience}
- Physical limitations or injuries: ${prompt.limitations || 'None'}
- Current energy level: ${energyLevel}/5

Recent workout history:
${historyData}

Based on the above information, recommend a workout focusing on the most neglected muscle group or the one that aligns best with the fitness goal.
Take into account how long it's been since each muscle group was last trained.
Adjust the number of sets and reps based on the energy level, with 5 being the highest energy.
Suggest appropriate rest periods between sets.

Respond ONLY with a valid JSON object in this exact format:
{
  "muscleGroup": "chest", (must be one of: shoulders, legs, back, arms, chest)
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": 10,
      "restSecs": 60
    }
  ],
  "reasoning": "Brief explanation of why this workout was chosen"
}`;
};

// Process Gemini's response and convert it to a Workout object
const processAiResponse = (aiResponse: string, energyLevel: number): Workout => {
  try {
    // Extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in response");

    const parsedResponse = JSON.parse(jsonMatch[0]);
    const muscleGroup = parsedResponse.muscleGroup as MuscleGroup;
    
    if (!muscleGroup || !["shoulders", "legs", "back", "arms", "chest"].includes(muscleGroup)) {
      throw new Error("Invalid muscle group in AI response");
    }

    // Get available exercises for the recommended muscle group
    const availableExercises = exercises[muscleGroup];
    
    // Create workout exercises from AI recommendations
    const workoutExercises: WorkoutExercise[] = parsedResponse.exercises.map((ex: any, index: number) => {
      // Use an existing exercise if possible, or create a new one
      const matchedExercise = availableExercises.find(e => 
        e.name.toLowerCase().includes(ex.name.toLowerCase())
      ) || availableExercises[index % availableExercises.length];

      return {
        exercise: matchedExercise,
        sets: Array(ex.sets || 3).fill(null).map(() => ({
          reps: ex.reps || 10,
          completed: false
        }))
      };
    });

    // Create a complete workout
    const workout: Workout = {
      id: `workout-${uuidv4()}`,
      date: new Date().toISOString(),
      energyLevel,
      exercises: workoutExercises,
      completed: false,
      aiGenerated: true,
      reasoning: parsedResponse.reasoning || "Based on your fitness goals and history"
    };

    return workout;
  } catch (error) {
    console.error("Error processing AI response:", error);
    // Fall back to regular workout generation if AI processing fails
    throw error;
  }
};

// Call Gemini API and get workout recommendations
export const getAiWorkoutRecommendation = async (
  prompt: AIWorkoutPrompt,
  energyLevel: number
): Promise<Workout> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("Gemini API key not found");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: generatePrompt(prompt, energyLevel),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiText) {
      throw new Error("No response from Gemini API");
    }

    return processAiResponse(aiText, energyLevel);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
