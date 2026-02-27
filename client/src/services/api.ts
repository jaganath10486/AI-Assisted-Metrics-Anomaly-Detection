import axios from 'axios';
import { IAnomaly } from '../interfaces/anomaly.interface';
import { IChatMessage, IChatSession } from '../interfaces/chatSession.interface';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  getAnomalies: async (): Promise<{ data: IAnomaly[] }> => {
    const { data } = await apiClient.get('/anomalies');
    return data;
  },

  getChatByAnomalyId: async (anomalyId: string): Promise<{ data: {data: IChatMessage[], sessionId: string | null} }> => {
    const { data } = await apiClient.get(`/chat/anomaly/${anomalyId}`);
    return data;
  },

  startChatSession: async (anomalyId: string, message: string): Promise<{ data: { reply: string, sessionId: string } }> => {
    const { data } = await apiClient.post('/chat/start', { anomalyId, message });
    return data;
  },

  sendChatMessage: async (sessionId: string, message: string): Promise<{ data: { reply: string, sessionId: string } }> => {
    const { data } = await apiClient.post(`/chat/${sessionId}/message`, { message });
    return data;
  },

  getChatSession: async (sessionId: string): Promise<IChatSession> => {
    const { data } = await apiClient.get(`/chat/${sessionId}`);
    return data;
  },
};
