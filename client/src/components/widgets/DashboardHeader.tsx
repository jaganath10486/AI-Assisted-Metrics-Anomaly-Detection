export function DashboardHeader() {
    return (
        <header className="flex items-center justify-between py-6 mb-4 border-b border-[#1e2230]">
            <div className="flex items-center gap-6 w-full">
                <div className="flex items-center gap-2 justify-center w-full">
                    <h1 className="text-xl font-bold tracking-tight">
                        <span className="text-white">AI Assisted Metrics Anomaly Detection</span>
                    </h1>
                </div>
            </div>
        </header>
    );
    
}