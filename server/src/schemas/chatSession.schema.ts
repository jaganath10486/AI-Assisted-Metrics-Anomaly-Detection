import { Schema, SchemaTypes, model } from "mongoose";
import { IChatSession, ChatRole } from "@interfaces/chatSession.interface";

const ChatMessageSchema = new Schema({
  role:      { type: SchemaTypes.String, enum: Object.values(ChatRole), required: true },
  content:   { type: SchemaTypes.String, required: true },
  timestamp: { type: SchemaTypes.Date, default: Date.now },
}, { _id: false });

const ChatSessionSchema: Schema = new Schema({
  sessionId: { type: SchemaTypes.String, required: true, unique: true },
  anomalyId: { type: SchemaTypes.ObjectId, ref: 'Anomaly', required: false },
  messages:  [ChatMessageSchema],
  createdAt: { type: SchemaTypes.Date, default: Date.now },
}, { timestamps: false });

ChatSessionSchema.index({ anomalyId: 1, createdAt: -1 });

export default model<IChatSession>('ChatSession', ChatSessionSchema);
