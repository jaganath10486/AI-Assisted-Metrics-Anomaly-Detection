import Metric from "@schemas/metrics.schema";
import { IMetric } from "@interfaces/metrics.interface";

export class MetricService {
  public async getAllMetrics(): Promise<IMetric[]> {
    const metrics: IMetric[] = await Metric.find();
    return metrics;
  }

  public async deleteAll(): Promise<void> {
    await Metric.deleteMany({});
  }

  public async insertMany(items: Partial<IMetric>[]): Promise<IMetric[]> {
    return await Metric.insertMany(items, { ordered: false }) as any;
  }

  public async getHistory(service: string, metricName: string, fromDate: Date, toDate: Date): Promise<Pick<IMetric, 'value' | 'timestamp'>[]> {
    return await Metric.find({
      service,
      metricName,
      timestamp: { $gte: fromDate, $lte: toDate },
    })
    .select("value timestamp -_id")
    .lean()
    .sort({ timestamp: -1 }) as any;
  }

  public async getUniqueServiceMetrics(): Promise<{ service: string; metricName: string }[]> {
    return await Metric.aggregate([
      {
        $group: {
          _id: { service: "$service", metricName: "$metricName" },
        },
      },
      {
        $project: {
          _id: 0,
          service: "$_id.service",
          metricName: "$_id.metricName",
        },
      },
    ]);
  }
}
