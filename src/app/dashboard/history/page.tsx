import HistoryView from "@/components/history-view";

export default function HistoryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Data History</h1>
                <p className="text-muted-foreground">Review and manage your past entries.</p>
            </div>
            <HistoryView />
        </div>
    );
}
