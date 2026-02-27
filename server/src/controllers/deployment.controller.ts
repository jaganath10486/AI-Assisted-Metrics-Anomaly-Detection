import { Request, Response, NextFunction } from "express";
import { DeploymentService } from "@services/deployment.service";
import { StatusCodes } from "http-status-codes";

class DeploymentController {
  private deploymentService = new DeploymentService();

  public getDeployments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deployments = await this.deploymentService.getAllDeployments();
      res.status(StatusCodes.OK).json({ data: deployments, message: "findAllDeployments" });
    } catch (error) {
      next(error);
    }
  };
}

export default DeploymentController;
