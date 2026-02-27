import { Schema, SchemaTypes, model } from "mongoose";

import { ICodeMap } from "@interfaces/codemap.interface";

const KeyFunctionSchema = new Schema({
  name: { type: SchemaTypes.String, required: true },
  file: { type: SchemaTypes.String, required: true },
}, { _id: false });


const MetricOwnershipSchema = new Schema({
  metricName: { type: SchemaTypes.String, required: true },
  keyFunctions: [KeyFunctionSchema],
}, { _id: false });


const CodeMapSchema: Schema<ICodeMap> = new Schema<ICodeMap>({
  name: { type: SchemaTypes.String, required: true },
  metricOwnership: [MetricOwnershipSchema],
}, { timestamps: true });

export default model<ICodeMap>('CodeMap', CodeMapSchema);
