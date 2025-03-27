
import React from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AIWorkoutPrompt } from '@/types';
import { Sparkles, Clock, Dumbbell } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface AiWorkoutFormProps {
  onSubmit: (data: AIWorkoutPrompt) => void;
  isLoading: boolean;
}

const AiWorkoutForm: React.FC<AiWorkoutFormProps> = ({ onSubmit, isLoading }) => {
  const form = useForm<AIWorkoutPrompt>({
    defaultValues: {
      fitnessGoal: 'strength',
      experience: 'intermediate',
      limitations: '',
    },
  });

  const handleSubmit = (data: AIWorkoutPrompt) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="swiss-title text-2xl">AI Workout Generator</h2>
          <Sparkles className="h-5 w-5 text-swiss-red" />
        </div>
        <p className="text-muted-foreground">
          Let AI create a personalized workout based on your needs and workout history.
        </p>
      </div>

      <div className="bg-zinc-100 p-4 rounded-md mb-4">
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-swiss-red mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Intelligent workout planning</p>
            <p className="text-muted-foreground mt-1">
              The AI will analyze your previous workouts to suggest appropriate exercises, sets, and reps based on your history and current energy level.
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fitnessGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fitness Goal</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a fitness goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="hypertrophy">Muscle Building</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="weightloss">Weight Loss</SelectItem>
                    <SelectItem value="toning">Toning</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="limitations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Physical Limitations (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe any injuries or physical limitations"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Let us know if you have any injuries or limitations we should consider.
                </FormDescription>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="swiss-button w-full mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Workout...' : 'Generate AI Workout'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AiWorkoutForm;
