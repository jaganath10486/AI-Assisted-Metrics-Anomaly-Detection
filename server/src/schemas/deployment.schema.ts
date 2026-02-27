import { Schema, SchemaTypes, model } from "mongoose";
import { IDeployment } from "@interfaces/deployment.interface";
import { DeploymentStatus } from "@enums/deployment.enum";

const DeploymentSchema: Schema = new Schema({
  service:    { type: SchemaTypes.String, required: true },
  commitSha:  { type: SchemaTypes.String, required: true },
  commitMsg:  { type: SchemaTypes.String, required: true },
  author:     { type: SchemaTypes.String, required: true },
  status:     { 
    type: SchemaTypes.String, 
    enum: Object.values(DeploymentStatus), 
    required: true,
    default: DeploymentStatus.DEPLOYED
  },
  deployedAt: { type: SchemaTypes.Date, default: Date.now },
}, { timestamps: true });

DeploymentSchema.index({ service: 1, deployedAt: -1 });

export default model<IDeployment>('Deployments', DeploymentSchema);
