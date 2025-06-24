import VisualizationsSuggester from "@/components/visualizations-suggester";

export default function VisualizationsPage() {
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">Smart Visualizations</h1>
                <p className="text-muted-foreground">Get AI-powered suggestions for visualizing your data.</p>
            </div>
            <VisualizationsSuggester />
        </div>
    );
}
