import { Router } from "express";
import MetricController from "@controllers/metrics.controller";

class MetricRoute {
  public path = '/metrics';
  public router = Router();
  public metricController = new MetricController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.metricController.getMetrics);
  }
}

export default MetricRoute;
