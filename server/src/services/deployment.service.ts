import Deployment from "@schemas/deployment.schema";
import { IDeployment } from "@interfaces/deployment.interface";

export class DeploymentService {
  public async getAllDeployments(): Promise<IDeployment[] | null> {
    const deployments: IDeployment[] = await Deployment.find().sort({ deployedAt: -1 });
    return deployments;
  }
  
  public async deleteAll(): Promise<void> {
    await Deployment.deleteMany({});
  }

  public async insertMany(items: any): Promise<any[]> {
    return await Deployment.insertMany(items);
  }

  public async findMostRecentBefore(service: string, dateObj: Date): Promise<IDeployment | null> {
    return await Deployment.findOne({
      service,
      deployedAt: { $lte: dateObj },
    })
      .sort({ deployedAt: -1 })
      .lean();
  }
}
