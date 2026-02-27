import { Request, Router } from "express";

export interface IResult {
  data: any;
  pagination?: any;
  error?: {
    description?: string;
    statusCode?: any;
    errorType?: any;
  };

  message: string;
  success: boolean;
  additionalData?: any;
}

export interface Routes {
  baseUrl?: string;
  initiallizeRoutes: () => void;
  router: Router;
}
