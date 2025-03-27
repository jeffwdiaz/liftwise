
import { AIWorkoutPrompt, Workout, MuscleGroup, WorkoutExercise } from "@/types";
import exercises from "@/data/exercises";
import { v4 as uuidv4 } from "uuid";

// This would typically come from an environment variable
// Since this is a frontend-only app, we'll handle it in localStorage for demo purposes
const getGeminiApiKey = (): string | null => {
  return localStorage.getItem("gemini_api_key");
};

// Save API key to localStorage
export const saveGeminiApiKey = (apiKey: string): void => {
  localStorage.setItem("gemini_api_key", apiKey);
};

// Check if API key exists
export const hasGeminiApiKey = (): boolean => {
  return !!getGeminiApiKey();
};

// Generate a prompt for Gemini based on user preferences
const generatePrompt = (prompt: AIWorkoutPrompt, energyLevel: number): string => {
  return `Create a personalized workout plan with the following details:
- Fitness goal: ${prompt.fitnessGoal}
- Experience level: ${prompt.experience}
- Physical limitations or injuries: ${prompt.limitations}
- Current energy level: ${energyLevel}/5

Respond ONLY with a valid JSON object in this exact format:
{
  "muscleGroup": "chest", (must be one of: shoulders, legs, back, arms, chest)
  "exercises": [
    {
      "name": "Exercise Name",
      "sets": 3,
      "reps": 10
    }
  ]
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
      aiGenerated: true
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
