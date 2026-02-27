import MetricModel from "@schemas/metrics.schema";
import DeploymentModel from "@schemas/deployment.schema";
import CodeMapModel from "@schemas/codemap.schema";
import AnomalyModel from "@schemas/anomaly.schema";
import { AnomalySeverity, AnomalyStatus, DetectionMethod } from "@enums/anomaly.enum";


//Rolling window size for baseline calculation
const WINDOW_SIZE = 20;


//Z-score threshold for spike detection
const Z_THRESHOLD = 3;

//Consecutive breaches required for sustained anomaly
const SUSTAINED_POINTS = 5;

export class AnomalyDetectionService {
  public async detectAndStoreAnomalies(): Promise<number> {
    const anomaliesToInsert: any[] = [];

    //Get all metrics grouped by service + metricName sorted by time
    const metrics = await MetricModel.aggregate([
      {
        $sort: { timestamp: 1 }
      },
      {
        $group: {
          _id: { service: "$service", metricName: "$metricName" },
          points: { $push: "$$ROOT" }
        }
      }
    ]);

    for (const group of metrics) {
      const { service, metricName } = group._id;
      const points = group.points;

      if (points.length <= WINDOW_SIZE) continue;

      let sustainedCount = 0;
      let windowSum = 0;
      let windowSqSum = 0;

      //Initialize the first rolling window
      for (let i = 0; i < WINDOW_SIZE; i++) {
        windowSum += points[i].value;
        windowSqSum += points[i].value * points[i].value;
      }

      for (let i = WINDOW_SIZE; i < points.length; i++) {
        const current = points[i];
        const old = points[i - WINDOW_SIZE];

        const mean = windowSum / WINDOW_SIZE;
        let variance = (windowSqSum / WINDOW_SIZE) - (mean * mean);
        if (variance < 0) variance = 0;
        
        const std = Math.sqrt(variance);

        // Advance the sliding window for the NEXT iteration's baseline
        windowSum = windowSum - old.value + current.value;
        windowSqSum = windowSqSum - (old.value * old.value) + (current.value * current.value);

        if (std === 0) continue;

        const zScore = (current.value - mean) / std;
        const isSpike = Math.abs(zScore) > Z_THRESHOLD;

        if (isSpike) {
          sustainedCount++;
        } else {
          sustainedCount = 0;
        }

        //Detect anomaly
        if (isSpike && sustainedCount >= SUSTAINED_POINTS) {
          const anomaly = await this.buildAnomalyObject({
            service,
            metricName,
            currentValue: current.value,
            baseline: mean,
            zScore,
            detectedAt: current.timestamp
          });

          anomaliesToInsert.push(anomaly);

          // Reset sustained count to prevent duplicate
          sustainedCount = 0; 
        }
      }
    }

    if (anomaliesToInsert.length) {
      await AnomalyModel.insertMany(anomaliesToInsert);
    }

    return anomaliesToInsert.length;
  }

  private async buildAnomalyObject({
    service,
    metricName,
    currentValue,
    baseline,
    zScore,
    detectedAt
  }: {
    service: string;
    metricName: string;
    currentValue: number;
    baseline: number;
    zScore: number;
    detectedAt: Date;
  }) {
    //Get latest deployment before anomaly
    const deployment = await DeploymentModel.findOne({
      service,
      deployedAt: { $lte: detectedAt }
    }).sort({ deployedAt: -1 });

    let timeSinceDeploy = 0;
    let confidence = 0.5; // basic confidence

    if (deployment) {
      timeSinceDeploy =
        (detectedAt.getTime() - deployment.deployedAt.getTime()) /
        (1000 * 60);
      console.log("deployment", deployment);
      console.log("timeSinceDeploy", timeSinceDeploy);
      // Time proximity scoring
      if (timeSinceDeploy < 10) confidence += 0.5;
      else if (timeSinceDeploy < 30) confidence += 0.3;
      else if (timeSinceDeploy < 60) confidence += 0.1;
    }

    // Magnitude scoring
    const spikeRatio = baseline > 0 ? currentValue / baseline : 0;

    if (spikeRatio > 5) confidence += 0.3;
    else if (spikeRatio > 3) confidence += 0.2;

    confidence = Math.min(confidence, 1);
    confidence = parseFloat(confidence.toFixed(2));

    //Get relevant functions from CodeMap
    const codeMap = await CodeMapModel.findOne({ name: service });

    let relevantFunctions: any[] = [];

    if (codeMap) {
      const ownership = codeMap.metricOwnership.find(
        (m: any) => m.metricName === metricName
      );

      if (ownership) {
        relevantFunctions = ownership.keyFunctions;
      }
    }

    //Determine severity
    let severity: AnomalySeverity = AnomalySeverity.LOW;

    if (Math.abs(zScore) > 6) severity = AnomalySeverity.CRITICAL;
    else if (Math.abs(zScore) > 4) severity = AnomalySeverity.HIGH;
    else if (Math.abs(zScore) > 3) severity = AnomalySeverity.MEDIUM;

    //Build anomaly document
    return {
      service,
      metricName,
      severity,
      status: AnomalyStatus.ACTIVE,
      detectedAt,
      detection: {
        method: DetectionMethod.Z_SCORE,
        anomalousValue: parseFloat(currentValue.toFixed(4)),
        baselineValue: parseFloat(baseline.toFixed(4)),
        zScore: parseFloat(zScore.toFixed(2)),
        confidence,
        explanation: `Value deviated ${zScore.toFixed(2)} standard deviations from rolling baseline.`
      },
      codeContext: deployment
        ? {
            deploymentId: deployment._id,
            timeSinceDeploy: Math.round(timeSinceDeploy),
            relevantFunctions
          }
        : undefined
    };
  }
}
