import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, ArrowUp } from 'lucide-react';
import { IAnomaly } from '../../interfaces/anomaly.interface';
import { IChatMessage, ChatRole } from '../../interfaces/chatSession.interface';
import { apiService } from '../../services/api';

interface Props {
    anomaly: IAnomaly;
    onClose: () => void;
}

export function ChatAssistantModal({ anomaly, onClose }: Props) {
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [inputVal, setInputVal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initDialog = async () => {
            try {
                const response = await apiService.getChatByAnomalyId(anomaly._id);
                if (response.data.sessionId) {
                    setSessionId(response.data.sessionId);
                    setMessages(response.data.data);
                } else {
                    setSessionId(null);
                    setMessages([]);
                }
            } catch (err) {
                console.log(err);
            }
        };
        initDialog();
    }, [anomaly._id]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: any) => {
        e?.preventDefault();
        if (!inputVal.trim()) return;

        const message: IChatMessage = {
            role: ChatRole.USER,
            content: inputVal,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, message]);
        setInputVal('');
        setIsLoading(true);

        try {
            if (!sessionId) {
                const response = await apiService.startChatSession(anomaly._id, message.content);
                setSessionId(response.data.sessionId);
                setMessages(prev => [...prev, {
                    role: ChatRole.MODEL,
                    content: response.data.reply,
                    timestamp: new Date().toISOString()
                }]);
            } else {
                const response = await apiService.sendChatMessage(sessionId, message.content);
                setMessages(prev => [...prev, {
                    role: ChatRole.MODEL,
                    content: response.data.reply,
                    timestamp: new Date().toISOString()
                }]);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090a0f]/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#12141a] border border-[#1e2230] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-indigo-500/10 flex flex-col h-[600px] animate-in slide-in-from-bottom-8 duration-300">

                <div className="flex items-center justify-between p-4 border-b border-[#1e2230] bg-[#0d0e14]">
                    <div className="flex items-center gap-3">
                        <div>
                            <h3 className="text-slate-100 font-bold text-sm">AI Assistant</h3>
                            <p className="text-slate-500 text-xs">Anomaly Investigation</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-[#1e2230]/50 px-4 py-3 flex justify-between items-center text-sm border-b border-[#1e2230]">
                    <div>
                        <span className="text-slate-500 mr-2">Investigating</span>
                        <span className="font-mono font-bold text-slate-300">{anomaly.service} / {anomaly.metricName}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-red-500 font-bold text-xs uppercase">{anomaly.severity}</span>
                        <span className="text-xs text-slate-500">z = {anomaly.detection.zScore.toFixed(1)}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
                    {messages.map((m, idx) => (
                        <div key={idx} className={`flex ${m.role === ChatRole.USER ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === ChatRole.USER ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-[#1e2230] text-slate-300 rounded-tl-none'} whitespace-pre-wrap leading-relaxed`}>
                                {m.content.split('**').map((part, i) => i % 2 !== 0 ? <strong key={i} className={m.role === ChatRole.USER ? 'text-white' : 'text-slate-100'}>{part}</strong> : part)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-[#1e2230] text-slate-300 rounded-tl-none flex gap-1 items-center h-10">
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>

                <div className="p-4 bg-[#0d0e14] border-t border-[#1e2230]">
                    <div className="flex flex-wrap gap-2 mb-3">
                        <button className="text-xs border border-[#2a2d36] rounded-full px-3 py-1.5 text-slate-400 hover:text-white hover:bg-[#1e2230] transition-colors cursor-pointer" onClick={() => setInputVal("How do I rollback?")}>How do I rollback?</button>
                        <button className="text-xs border border-[#2a2d36] rounded-full px-3 py-1.5 text-slate-400 hover:text-white hover:bg-[#1e2230] transition-colors cursor-pointer" onClick={() => setInputVal("What caused this?")}>What caused this?</button>
                        <button className="text-xs border border-[#2a2d36] rounded-full px-3 py-1.5 text-slate-400 hover:text-white hover:bg-[#1e2230] transition-colors cursor-pointer" onClick={() => setInputVal("How to prevent this?")}>How to prevent this?</button>
                    </div>
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            className="w-full bg-[#1e2230] rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 border border-transparent focus:border-indigo-500/50"
                            placeholder="Ask about this anomaly..."
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!inputVal.trim() || isLoading}
                            className="absolute right-2 top-2 bottom-2 w-8 flex items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 cursor-pointer hover:bg-indigo-500 hover:text-white transition-colors disabled:opacity-50"
                        >
                            <ArrowUp size={16} />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
