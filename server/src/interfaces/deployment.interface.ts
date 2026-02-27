import { Document } from "mongoose";
import { DeploymentStatus } from "@enums/deployment.enum";

export interface IDeployment extends Document {
  service: string;
  commitSha: string;
  commitMsg: string;
  author: string;
  status: DeploymentStatus;
  deployedAt: Date;
}
