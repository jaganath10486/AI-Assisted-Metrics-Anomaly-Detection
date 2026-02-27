import { Schema, SchemaTypes, model } from "mongoose";
import { IMetric } from "@interfaces/metrics.interface";

const MetricSchema: Schema = new Schema({
  service:    { type: SchemaTypes.String, required: true },
  metricName: { type: SchemaTypes.String, required: true },
  value:     { type: Number, required: true },
  timestamp: { type: Date,   required: true },

}, { timestamps: false });


MetricSchema.index({ service: 1, metricName: 1, timestamp: -1 });

export default model<IMetric>('Metrics', MetricSchema);