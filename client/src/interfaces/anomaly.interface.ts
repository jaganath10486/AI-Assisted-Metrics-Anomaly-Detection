import { IDeployment } from "./deployment.interface";

export interface IKeyFunction {
  name: string;
  file: string;
}

export interface IAnomalyDetection {
  method: string;
  anomalousValue: number;
  baselineValue: number;
  zScore: number;
  confidence: number;
  explanation: string;
}

export interface IAnomalyCodeContext {
  deploymentId: string | IDeployment;
  timeSinceDeploy: number;
  relevantFunctions: IKeyFunction[];
}

export interface IAnomaly {
  _id: string;
  service: string;
  metricName: string;
  severity: string;
  status: string;
  detection: IAnomalyDetection;
  codeContext?: IAnomalyCodeContext;
  detectedAt: string | Date;
  resolvedAt?: string | Date;
  createdAt: string | Date;
}
