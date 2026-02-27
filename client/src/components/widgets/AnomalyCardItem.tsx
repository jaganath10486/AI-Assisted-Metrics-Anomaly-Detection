import React from "react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Zap, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { IAnomaly } from "../../interfaces/anomaly.interface";

interface Props {
    data: IAnomaly;
    onAskAI: (id: string) => void;
}

export function AnomalyCardItem({ data, onAskAI }: Props) {
    console.log(data);  
    const isCritical = data.severity === 'critical';
    const titleColor = isCritical ? 'text-red-500' : 'text-orange-500';

    const timeAgo = data.detectedAt ? formatDistanceToNow(new Date(data.detectedAt), { addSuffix: true }) : "recently";

    const deployment = data.codeContext?.deploymentId as Record<string, unknown> | string | undefined;
    const commitSha = deployment && typeof deployment === 'object' ? (deployment.commitSha as string)?.substring(0, 7) : (typeof deployment === 'string' ? deployment.substring(0, 7) : "Unknown");
    const commitMsg = deployment && typeof deployment === 'object' ? (deployment.commitMsg as string) : "";

    return (
        <Card className={`relative overflow-hidden transition-all duration-300 border-t-2 ${isCritical ? 'border-t-red-500/50' : 'border-t-orange-500/50'} bg-[#13151c]/90`}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <Badge dot variant={isCritical ? 'critical' : 'high'}>
                                {data.severity.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-slate-500">{timeAgo}</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-100 mb-1">{data.service}</h3>
                            <p className="text-sm text-slate-400 capitalize">{data.metricName.replace('_', ' ')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#0b0c10] rounded-xl p-4">
                        <div className="text-xs font-semibold text-slate-500 mb-1 tracking-wider uppercase">Current</div>
                        <div className={`text-2xl font-bold ${titleColor} mb-1 flex items-baseline gap-1`}>
                            {data.detection.anomalousValue.toFixed(1)} <span className="text-sm">ms</span>
                        </div>
                    </div>
                    <div className="bg-[#0b0c10] rounded-xl p-4">
                        <div className="text-xs font-semibold text-slate-500 mb-1 tracking-wider uppercase">Baseline</div>
                        <div className="text-2xl font-bold text-slate-300 mb-1 flex items-baseline gap-1">
                            {data.detection.baselineValue.toFixed(1)} <span className="text-sm">ms</span>
                        </div>
                        <div className="text-xs text-slate-500">expected</div>
                    </div>
                    <div className="bg-[#0b0c10] rounded-xl p-4">
                        <div className="text-xs font-semibold text-slate-500 mb-1 tracking-wider uppercase">Z-Score</div>
                        <div className="text-2xl font-bold text-slate-300 mb-1 flex items-baseline gap-1">
                            {data.detection.zScore.toFixed(1)}
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="text-xs font-semibold text-slate-500 mb-2 tracking-wider uppercase flex justify-between">
                        <span>Detection Confidence</span>
                        <span className="text-slate-300">{data.detection.confidence*100}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1e2230] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400 opacity-90 transition-all duration-1000"
                            style={{ width: `${data.detection.confidence*100}%` }}
                        />
                    </div>
                </div>

                {data.codeContext && (
                    <div className="border border-[#2a2d36] rounded-xl p-4 bg-[#0d0f14] mb-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-500/10 to-transparent opacity-0 transition-opacity" />
                        <div className="flex items-center gap-2 mb-2 text-orange-400 font-semibold text-xs tracking-wider uppercase">
                            <Zap size={14} className="fill-orange-400 text-orange-400" /> {data.codeContext.timeSinceDeploy ? `Deploy ${data.codeContext.timeSinceDeploy}min before` : 'Recent Deployment'}
                        </div>
                        <div className="text-sm font-medium text-slate-300 mb-1 font-mono">
                            {commitSha}
                        </div>
                        <div className="text-sm text-slate-500">
                            {commitMsg}
                        </div>
                    </div>
                )}

                {data.codeContext?.relevantFunctions && data.codeContext?.relevantFunctions.length > 0 && (
                    <div className="flex items-center justify-between mb-6 border-b border-[#1e2230] pb-4">
                        <span className="text-sm text-slate-400">
                            {data.codeContext.relevantFunctions.length} relevant functions
                        </span>
                    </div>
                )}

                <div className="flex gap-4">
                    <Button
                        variant="gradient"
                        className="flex-1 text-white bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold"
                        icon={<Sparkles size={16} />}
                        onClick={() => onAskAI(data._id)}
                    >
                        Ask AI
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
