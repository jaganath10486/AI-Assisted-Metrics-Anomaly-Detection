export enum ChatRole {
  USER = 'user',
  MODEL = 'model',
}

export interface IChatMessage {
  role: ChatRole;
  content: string;
  timestamp: string | Date;
}

export interface IChatSession {
  _id: string;
  sessionId: string;
  anomalyId: string;
  messages: IChatMessage[];
  createdAt: string | Date;
}
