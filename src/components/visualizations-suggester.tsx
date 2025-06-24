'use client';

import { useState } from 'react';
import { getChartSuggestions } from '@/lib/actions';
import type { SuggestChartTypesOutput } from '@/ai/flows/suggest-chart-types';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

export default function VisualizationsSuggester() {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<SuggestChartTypesOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const suggestions = await getChartSuggestions(description);
      setResult(suggestions);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error getting suggestions',
        description: error.message || 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Describe Your Data</CardTitle>
                <CardDescription>
                    Explain the kind of data you've been recording (e.g., "daily mood on a scale of 1-10", "coffee cups per day", "project progress updates"). The more detail, the better the suggestions.
                </CardDescription>
            </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., I'm tracking my daily water intake in milliliters and my workout duration in minutes."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={loading}
              className="text-base"
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!description.trim() || loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Get Suggestions
            </Button>
          </CardFooter>
        </Card>
      </form>

      {result && (
        <Card className="mt-6 animate-in fade-in-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-accent-foreground h-6 w-6" />
                AI-Powered Suggestions
            </CardTitle>
            <CardDescription>
                Based on your description, here are some recommended ways to visualize your data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Suggested Chart Types:</h3>
              <div className="flex flex-wrap gap-2">
                {result.suggestedChartTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="text-base py-1 px-3 bg-accent/50 text-accent-foreground">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Reasoning:</h3>
                <p className="text-sm text-muted-foreground bg-background/50 p-4 rounded-md border">{result.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
