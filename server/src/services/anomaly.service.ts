import Anomaly from "@schemas/anomaly.schema";
import { IAnomaly } from "@interfaces/anomaly.interface";

export class AnomalyService {
  public async getAllAnomalies(): Promise<IAnomaly[]> {
    const anomalies: IAnomaly[] = await Anomaly.find()
      .populate('codeContext.deploymentId')
      .sort({ detectedAt: -1 });
    return anomalies;
  }

  public async deleteAll(): Promise<void> {
    await Anomaly.deleteMany({});
  }

  public async create(data: Partial<IAnomaly>): Promise<IAnomaly> {
    console.log("Data :", data)
    return await Anomaly.create(data);
  }
}
