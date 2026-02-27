import { Schema, SchemaTypes, model } from "mongoose";
import { IAnomaly } from "@interfaces/anomaly.interface";
import { AnomalySeverity, AnomalyStatus, DetectionMethod } from "@enums/anomaly.enum";

const KeyFunctionSchema = new Schema({
  name: { type: SchemaTypes.String, required: true },
  file: { type: SchemaTypes.String, required: true },
}, { _id: false });


const DetectionSchema = new Schema({
  method:         { type: SchemaTypes.String, enum: Object.values(DetectionMethod), required: true },
  anomalousValue: { type: SchemaTypes.Number, required: true },
  baselineValue:  { type: SchemaTypes.Number, required: true },
  zScore:         { type: SchemaTypes.Number, required: true },
  confidence:     { type: SchemaTypes.Number, required: true },
  explanation:    { type: SchemaTypes.String, required: true },
}, { _id: false });

const CodeContextSchema = new Schema({
  deploymentId:    { type: SchemaTypes.ObjectId, ref: 'Deployments', required: true },
  timeSinceDeploy: { type: SchemaTypes.Number, required: true },
  relevantFunctions: [KeyFunctionSchema],
}, { _id: false });

const AnomalySchema: Schema = new Schema({
  service:    { type: SchemaTypes.String, required: true },
  metricName: { type: SchemaTypes.String, required: true },
  severity:   { type: SchemaTypes.String, enum: Object.values(AnomalySeverity), required: true },
  status:     { type: SchemaTypes.String, enum: Object.values(AnomalyStatus), required: true, default: AnomalyStatus.ACTIVE },
  detection:  { type: DetectionSchema, required: true },
  codeContext:{ type: CodeContextSchema },
  detectedAt: { type: SchemaTypes.Date, default: Date.now },
  resolvedAt: { type: SchemaTypes.Date, default: null },
}, { timestamps: true });

AnomalySchema.index({ service: 1, metricName: 1, status: 1 });
AnomalySchema.index({ detectedAt: -1 });

export default model<IAnomaly>('Anomaly', AnomalySchema);
