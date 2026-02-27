import { Document, Types } from "mongoose";
import { AnomalySeverity, AnomalyStatus, DetectionMethod } from "@enums/anomaly.enum";
import { IKeyFunction } from "./codemap.interface";

export interface IAnomalyDetection {
  method: DetectionMethod;
  anomalousValue: number;
  baselineValue: number;
  zScore: number;
  confidence: number;
  explanation: string;
}

export interface IAnomalyCodeContext {
  deploymentId: Types.ObjectId;
  timeSinceDeploy: number;
  relevantFunctions: IKeyFunction[];
}

export interface IAnomaly extends Document {
  service: string;
  metricName: string;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  detection: IAnomalyDetection;
  codeContext?: IAnomalyCodeContext;
  detectedAt: Date;
  resolvedAt?: Date;
  createdAt: Date;
}
