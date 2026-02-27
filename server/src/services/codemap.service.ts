import CodeMap from "@schemas/codemap.schema";
import { ICodeMap } from "@interfaces/codemap.interface";

export class CodeMapService {
  public async deleteAll(): Promise<void> {
    await CodeMap.deleteMany({});
  }

  public async insertMany(items: Partial<ICodeMap>[]): Promise<ICodeMap[]> {
    return await CodeMap.insertMany(items) as any;
  }

  public async findByName(name: string): Promise<ICodeMap | null> {
    return await CodeMap.findOne({ name }).lean();
  }
}
