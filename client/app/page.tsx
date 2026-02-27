'use client';
import { useState, useEffect } from 'react';
import { DashboardHeader } from '../src/components/widgets/DashboardHeader';
import { AnomalyCardItem } from '../src/components/widgets/AnomalyCardItem';
import { ChatAssistantModal } from '../src/components/widgets/ChatAssistantModal';
import { IAnomaly } from '../src/interfaces/anomaly.interface';
import { apiService } from '../src/services/api';

export default function DashboardPage() {
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  const [anomalies, setAnomalies] = useState<IAnomaly[]>([]);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await apiService.getAnomalies();
        setAnomalies(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAnomalies();
  }, []);

  const handleAskAI = (id: string) => {
    setSelectedAnomalyId(id);
  };

  useEffect(() => {
    console.log(anomalies);
  }, [anomalies])

  const selectedAnomaly = anomalies.find(a => a._id === selectedAnomalyId);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-300 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {anomalies.map(anomaly => (
            <AnomalyCardItem
              key={anomaly._id}
              data={anomaly}
              onAskAI={handleAskAI}
            />
          ))}
        </div>
      </div>

      {selectedAnomaly && (
        <ChatAssistantModal
          anomaly={selectedAnomaly}
          onClose={() => setSelectedAnomalyId(null)}
        />
      )}
    </div>
  );
}
