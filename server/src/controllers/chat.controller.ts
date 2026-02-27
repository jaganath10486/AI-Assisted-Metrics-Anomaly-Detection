import { Request, Response, NextFunction } from "express";
import { ChatService } from "@services/chat.service";
import Anomaly from "@schemas/anomaly.schema";
import { StatusCodes } from "http-status-codes";

class ChatController {
  private chatService = new ChatService();

  public startChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { message, anomalyId } = req.body;
      let anomalyContextPayload = null;

      if (!message) {
        throw new Error("Message is required.");
      }

      if (anomalyId) {
        const anomaly = await Anomaly.findById(anomalyId).populate('codeContext.deploymentId');
        if (anomaly) {
            anomalyContextPayload = anomaly;
        }
      }

      const result = await this.chatService.startNewChat(
        message, 
        anomalyId, 
        anomalyContextPayload
      );

      res.status(StatusCodes.CREATED).json({ 
        data: {
          reply: result.response,
          sessionId: result.sessionId,
        }, 
        message: "New chat started successfully" 
      });
    } catch (error) {
      next(error);
    }
  };

  public continueChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.params.sessionId as string;
      const { message } = req.body;

      if (!sessionId) throw new Error("Session ID is required.");
      if (!message) throw new Error("Message is required.");

      const result = await this.chatService.continueChat(sessionId, message);

      res.status(StatusCodes.OK).json({ 
        data: {
          reply: result.response,
          sessionId: result.sessionId,
        }, 
        message: "Message processed successfully" 
      });
    } catch (error) {
      next(error);
    }
  };

  public getChatSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessions = await this.chatService.getChatSessions();
      res.status(StatusCodes.OK).json({ data: sessions, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public getChatSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.params.sessionId as string;
      const session = await this.chatService.getChatSession(sessionId);
      if (!session) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Chat session not found" });
        return;
      }
      res.status(StatusCodes.OK).json({ data: session, message: "findOne" });
    } catch (error) {
      next(error);
    }
  };

  public getChatSessionByAnomalyId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const anomalyId : any = req.params.anomalyId || '';
      const session = await this.chatService.getChatSessionByAnomalyId(anomalyId);
      if (!session) {
        res.status(StatusCodes.OK).json({ data: {data: [], sessionId : null}, message: "No chat history" });
      } else {
        res.status(StatusCodes.OK).json({ data: {data: session.messages, sessionId: session.sessionId}, message: "Chat history found" });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default ChatController;
