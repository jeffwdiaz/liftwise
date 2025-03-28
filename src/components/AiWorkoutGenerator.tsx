import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AiWorkoutGeneratorProps {
  energyLevel: number;
  equipment: string;
  onWorkoutGenerated: (workout: any) => void;
}

const AiWorkoutGenerator: React.FC<AiWorkoutGeneratorProps> = ({ 
  energyLevel, 
  equipment, 
  onWorkoutGenerated 
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const generateWorkout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Create a workout plan with the following details:
              - Energy Level: ${energyLevel}/5
              - Equipment Available: ${equipment}
              
              Please provide 4 exercises with appropriate sets and reps based on the energy level.
              Format the response as a JSON object with this structure:
              {
                "exercises": [
                  {
                    "name": "Exercise Name",
                    "sets": number,
                    "reps": number,
                    "rest": "rest period in seconds"
                  }
                ]
              }`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate workout');
      }

      const data = await response.json();
      const workout = JSON.parse(data.candidates[0].content.parts[0].text);
      onWorkoutGenerated(workout);
    } catch (err) {
      setError('Failed to generate workout. Please try again.');
      console.error('Error generating workout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">AI Workout Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            Energy Level: {energyLevel}/5
          </p>
          <p className="text-muted-foreground">
            Equipment: {equipment}
          </p>
        </div>
        
        {error && (
          <div className="text-red-500 text-center">
            {error}
          </div>
        )}

        <Button
          onClick={generateWorkout}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Workout...
            </>
          ) : (
            'Generate Workout'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AiWorkoutGenerator; 