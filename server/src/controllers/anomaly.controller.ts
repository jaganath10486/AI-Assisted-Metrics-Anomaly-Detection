import { Request, Response, NextFunction } from "express";
import { AnomalyService } from "@services/anomaly.service";
import { SeedingService } from "@services/seed.service";
import { StatusCodes } from "http-status-codes";

class AnomalyController {
  private anomalyService = new AnomalyService();
  private seedingService = new SeedingService();

  public getAnomalies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log("Inside the get all anomalies")
      const anomalies = await this.anomalyService.getAllAnomalies();
      res.status(StatusCodes.OK).json({ data: anomalies, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public runAnomaliesDetection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const summary = await this.seedingService.runAnomaliesDetection();
      res.status(StatusCodes.CREATED).json({ 
        data: summary, 
        message: "Mock generating, metric pushing, and anomaly detection completed successfully." 
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AnomalyController;
