import { Document } from "mongoose";

export interface IKeyFunction {
  name: string;
  file: string;
}

export interface IMetricOwnership {
  metricName: string;
  keyFunctions: IKeyFunction[];
}

export interface ICodeMap extends Document {
  name: string;
  metricOwnership: IMetricOwnership[];
}
