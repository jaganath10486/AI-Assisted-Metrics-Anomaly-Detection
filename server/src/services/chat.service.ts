import { GoogleGenerativeAI } from "@google/generative-ai";
import ChatSession from "@schemas/chatSession.schema";
import { IChatSession, ChatRole } from "@interfaces/chatSession.interface";
import { GEMINI_API_KEY } from "@configs/environment";
import { Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export class ChatService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");
  }

  private getModel(systemInstruction?: string) {
    return this.genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        ...(systemInstruction && { systemInstruction })
    });
  }

  public async startNewChat(
    message: string,
    anomalyId?: string,
    anomalyContextPayload?: any
  ): Promise<{ response: string; sessionId: string; chatSession: IChatSession }> {
    
    const now = new Date();

    const chatSession = new ChatSession({
      sessionId: uuidv4(),
      anomalyId: anomalyId ? new Types.ObjectId(anomalyId) : undefined,
      messages: [],
      createdAt: now,
    });

    console.log("Message :", message)
    console.log("Anomaly Context :", anomalyContextPayload)
    console.log("Anomaly Id :", anomalyId)

    let systemInstruction = "You are an AI assistant analyzing anomaly metrics.";
    if (anomalyContextPayload) {
      const anomaly = anomalyContextPayload;

      const metric = anomaly.metricName;
      const service = anomaly.service;
      const severity = anomaly.severity;
      const time = new Date(anomaly.detectedAt).toLocaleTimeString();
      
      const val = anomaly.detection.anomalousValue;
      const base = anomaly.detection.baselineValue;
      const zScore = anomaly.detection.zScore;
      const method = anomaly.detection.method;

      let prompt = `You are an AI assistant analyzing anomaly metrics. Here is the current incident context:\n\n`;
      prompt += `ANOMALY: ${metric} on ${service} spiked to ${val} at ${time}\n`;
      prompt += `(baseline: ${base}, z-score: ${zScore}, type: ${method}, severity: ${severity})\n\n`;

      if (anomaly.codeContext) {
         const codeCtx = anomaly.codeContext;
         if (codeCtx.deploymentId) {
             const dep : any = codeCtx.deploymentId;
             prompt += `RECENT DEPLOYMENT: commit ${dep.commitSha} at ${new Date(dep.deployedAt).toLocaleTimeString()} by ${dep.author}\n`;
             prompt += `Message: "${dep.commitMsg}"\n\n`;
         }
         if (codeCtx.relevantFunctions && codeCtx.relevantFunctions.length > 0) {
             const funcs = codeCtx.relevantFunctions.map((f: any) => `${f.name}()`).join(", ");
             prompt += `KEY FUNCTIONS: ${funcs}\n`;
         }
      }

      systemInstruction = prompt;
    }

    const model = this.getModel(systemInstruction);
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    chatSession.messages.push({
      role: ChatRole.USER,
      content: message,
      timestamp: new Date()
    });

    const result = await chat.sendMessage(message);
    const textResponse = result.response.text();

    chatSession.messages.push({
      role: ChatRole.MODEL,
      content: textResponse,
      timestamp: new Date()
    });

    await chatSession.save();

    return {
      response: textResponse,
      sessionId: chatSession.sessionId,
      chatSession
    };
  }

    
  public async continueChat(
    sessionId: string,
    message: string,
  ): Promise<{ response: string; sessionId: string; chatSession: IChatSession }> {
    
    const chatSession = await ChatSession.findOne({ sessionId });
    
    if (!chatSession) {
      throw new Error(`Chat session not found for sessionId: ${sessionId}`);
    }
    
    const history = chatSession.messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    chatSession.messages.push({
      role: ChatRole.USER,
      content: message,
      timestamp: new Date()
    });

      
    const model = this.getModel();
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const textResponse = result.response.text();

    chatSession.messages.push({
      role: ChatRole.MODEL,
      content: textResponse,
      timestamp: new Date()
    });

    await chatSession.save();

    return {
      response: textResponse,
      sessionId: chatSession.sessionId,
      chatSession
    };
  }

  public async getChatSessions(): Promise<IChatSession[]> {
    return await ChatSession.find().sort({ createdAt: -1 });
  }

  public async getChatSession(sessionId: string): Promise<IChatSession | null> {
    return await ChatSession.findOne({ sessionId });
  }

  public async getChatSessionByAnomalyId(anomalyId: string): Promise<IChatSession | null> {
    return await ChatSession.findOne({ anomalyId: new Types.ObjectId(anomalyId) }).sort({ createdAt: -1 });
  }
}
