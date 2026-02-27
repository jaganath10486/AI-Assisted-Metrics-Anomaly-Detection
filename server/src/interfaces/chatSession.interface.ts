import { Document, Types } from "mongoose";

export enum ChatRole {
    USER = 'user',
    MODEL = 'model',
}

export interface IChatMessage {
  role: ChatRole;
  content: string;
  timestamp: Date;
}

export interface IChatSession extends Document {
  sessionId: string;
  anomalyId: Types.ObjectId;
  messages: IChatMessage[];
  createdAt: Date;
}
