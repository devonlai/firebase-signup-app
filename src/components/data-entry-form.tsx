'use client';

import { useState } from 'react';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardFooter } from './ui/card';
import { Loader2 } from 'lucide-react';

export default function DataEntryForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'data_entries'), {
        content: content,
        createdAt: serverTimestamp(),
      });
      console.log('Document written with ID: ', docRef.id);
      toast({
        title: 'Entry Saved!',
        description: 'Your data has been successfully recorded.',
      });
      setContent('');
    } catch (error) {
      console.error('Error adding document: ', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'There was an error saving your entry. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="p-6">
          <Textarea
            placeholder="Type your data, notes, or thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="text-base"
            disabled={isSubmitting}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={!content.trim() || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Entry
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
