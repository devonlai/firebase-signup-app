import DataEntryForm from '@/components/data-entry-form';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">New Diary Entry</h1>
        <p className="text-muted-foreground">What's on your mind today? Record any data point, thought, or event.</p>
       </div>
      <DataEntryForm />
    </div>
  );
}
