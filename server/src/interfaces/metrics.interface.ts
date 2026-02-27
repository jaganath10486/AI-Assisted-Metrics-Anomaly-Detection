import { Document } from "mongoose";

export interface IMetric extends Document {
  service: string;
  metricName: string;
  value: number;
  timestamp: Date;
}
