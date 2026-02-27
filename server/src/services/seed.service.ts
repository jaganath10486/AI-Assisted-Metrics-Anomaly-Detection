import { CodeMapService } from "./codemap.service";
import { DeploymentService } from "./deployment.service";
import { MetricService } from "./metrics.service";
import { AnomalyService } from "./anomaly.service";
import { AnomalyDetectionService } from "./anomalyDetection.service";
import { AnomalyStatus, AnomalySeverity } from "@enums/anomaly.enum";
import {
  getMockCodeMap,
  getMockDeployment,
  generateHistoricalMetrics,
} from "../data/mockGenerator";

export class SeedingService {
  private codeMapService = new CodeMapService();
  private deploymentService = new DeploymentService();
  private metricService = new MetricService();
  private anomalyService = new AnomalyService();
  private anomalyDetectionService = new AnomalyDetectionService();

  public async runAnomaliesDetection(): Promise<{
    codeMapsConfigured: number;
    deploymentsConfigured: number;
    metricsInserted: number;
    anomaliesDetected: number;
  }> {
    await this.codeMapService.deleteAll();
    await this.deploymentService.deleteAll();
    await this.metricService.deleteAll();
    await this.anomalyService.deleteAll();

    // 1. CodeMaps
    const codeMaps = await this.codeMapService.insertMany(getMockCodeMap());

    // 2. Deployments
    const deployments = await this.deploymentService.insertMany(
      getMockDeployment(),
    );

    // 3. Metrics
    const metricPoints = generateHistoricalMetrics();
    const BATCH = 500;
    let insertedMetrics = 0;

    for (let i = 0; i < metricPoints.length; i += BATCH) {
      await this.metricService.insertMany(
        metricPoints.slice(i, i + BATCH) as any[],
      );
      insertedMetrics += Math.min(BATCH, metricPoints.length - i);
    }

    // 4. Run Detection and Storing
    const insertedAnomalies = await this.anomalyDetectionService.detectAndStoreAnomalies();

    return {
      codeMapsConfigured: codeMaps.length,
      deploymentsConfigured: deployments.length,
      metricsInserted: insertedMetrics,
      anomaliesDetected: insertedAnomalies,
    };
  }
}
