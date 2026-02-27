import { Router } from "express";
import AnomalyController from "@controllers/anomaly.controller";

class AnomalyRoute {
  public path = "/anomalies";
  public router = Router();
  public anomalyController = new AnomalyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.anomalyController.getAnomalies);
    this.router.post(
      `${this.path}/test`,
      this.anomalyController.runAnomaliesDetection,
    );
  }
}

export default AnomalyRoute;
