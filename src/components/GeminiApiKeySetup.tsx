
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveGeminiApiKey, hasGeminiApiKey } from '@/utils/aiUtils';
import { KeyRound } from 'lucide-react';

interface GeminiApiKeySetupProps {
  onApiKeySet: () => void;
}

const GeminiApiKeySetup: React.FC<GeminiApiKeySetupProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }

    try {
      saveGeminiApiKey(apiKey.trim());
      setError(null);
      onApiKeySet();
    } catch (err) {
      setError('Failed to save API key');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="swiss-title text-2xl">Connect to Gemini AI</h2>
        <p className="text-muted-foreground">
          To get personalized workout recommendations, you'll need a Gemini API key.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-zinc-100 p-4 rounded-md">
          <div className="flex items-start gap-3">
            <KeyRound className="h-5 w-5 text-swiss-red mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Get your API key</p>
              <p className="text-muted-foreground mt-1">
                Get a Gemini API key from the{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-swiss-red underline"
                >
                  Google AI Studio
                </a>{" "}
                and paste it below.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Enter your Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="focus:border-swiss-red focus:ring-swiss-red"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <Button 
          onClick={handleSaveApiKey} 
          className="swiss-button w-full"
        >
          Save API Key
        </Button>
      </div>
    </div>
  );
};

export default GeminiApiKeySetup;
