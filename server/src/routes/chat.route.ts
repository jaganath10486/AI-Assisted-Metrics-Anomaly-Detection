import { Router } from "express";
import ChatController from "@controllers/chat.controller";

class ChatRoute {
  public path = '/chat';
  public router = Router();
  public chatController = new ChatController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/start`, this.chatController.startChat);
    this.router.post(`${this.path}/:sessionId/message`, this.chatController.continueChat);
    this.router.get(`${this.path}`, this.chatController.getChatSessions);
    this.router.get(`${this.path}/anomaly/:anomalyId`, this.chatController.getChatSessionByAnomalyId);
    this.router.get(`${this.path}/:sessionId`, this.chatController.getChatSession);
  }
}

export default ChatRoute;
