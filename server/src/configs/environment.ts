import { MongoDBConfig } from "@interfaces/config.interface";
import dotenv from "dotenv";
dotenv.config();

export const {
  PORT,
  NODE_ENV,
  MONGODB_URL,
  GEMINI_API_KEY
} = process.env;
export const MongoDbAccessConfig: MongoDBConfig = {
  url: MONGODB_URL || "",
};

export const ISPROD = NODE_ENV == "production" ? true: false;
