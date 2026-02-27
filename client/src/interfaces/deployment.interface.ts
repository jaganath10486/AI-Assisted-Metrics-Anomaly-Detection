
export interface IDeployment {
  _id: string;
  service: string;
  commitSha: string;
  commitMsg: string;
  author: string;
  status: string;
  deployedAt: string | Date;
}
