'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy, Query } from 'firebase/firestore';
import type { DataEntry } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Loader2, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GroupedEntries {
  [key: string]: DataEntry[];
}

function EntryCard({ entry }: { entry: DataEntry }) {
  return (
    <div className="p-4 bg-background/50 rounded-md border">
        <p className="text-sm text-foreground">{entry.content}</p>
        <p className="text-xs text-muted-foreground mt-2">
            {format(entry.createdAt.toDate(), 'p')}
        </p>
    </div>
  );
}

export default function HistoryView() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const entriesCollection = collection(db, 'users', user.uid, 'data_entries');
        const q = query(entriesCollection, orderBy('createdAt', sortOrder));
        const querySnapshot = await getDocs(q);
        const fetchedEntries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as DataEntry[];
        setEntries(fetchedEntries);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user, sortOrder]);

  const groupedEntries = useMemo(() => {
    return entries.reduce((acc: GroupedEntries, entry) => {
        const dateKey = format(entry.createdAt.toDate(), 'MMMM d, yyyy');
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(entry);
        return acc;
    }, {});
  }, [entries]);

  const handleExport = () => {
    const dataStr = JSON.stringify(
      entries.map(e => ({
        content: e.content,
        createdAt: e.createdAt.toDate().toISOString(),
      })),
      null,
      2
    );
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `DataDiary_export_${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card className="text-center py-10">
        <CardHeader>
          <CardTitle>No Entries Yet</CardTitle>
          <CardDescription>Start by adding a new entry on the main dashboard.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <div className="w-40">
                <Select onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)} defaultValue={sortOrder}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest first</SelectItem>
                        <SelectItem value="asc">Oldest first</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export as JSON
            </Button>
        </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {Object.entries(groupedEntries).map(([date, dateEntries]) => (
          <AccordionItem value={date} key={date} className="border bg-card rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold font-headline hover:no-underline">
              {date}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                {dateEntries.map(entry => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
