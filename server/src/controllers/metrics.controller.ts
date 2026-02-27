import { Request, Response, NextFunction } from "express";
import { MetricService } from "@services/metrics.service";
import { StatusCodes } from "http-status-codes";

class MetricController {
  private metricService = new MetricService();

  public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = await this.metricService.getAllMetrics();
      res.status(StatusCodes.OK).json({ data: metrics, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };
}

export default MetricController;
