import { Router } from "express";
import DeploymentController from "@controllers/deployment.controller";

class DeploymentRoute {
  public path = '/deployments';
  public router = Router();
  public deploymentController = new DeploymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.deploymentController.getDeployments);
  }
}

export default DeploymentRoute;
