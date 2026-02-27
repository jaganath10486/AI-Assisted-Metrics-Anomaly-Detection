import {IResult } from "@interfaces/request.interface";
import { isEmpty } from "@utils/data.util";
import { NextFunction, Response, Request } from "express";

export const ResponseModifier = (req: Request, res: any, next: any) => {
  try {
    const originalJson = res.json.bind(res);
    const originalStatus = res.status.bind(res);
    let statusCode = 200;

    res.status = function (code: number) {
      statusCode = code;
      return originalStatus(code);
    };

    res.json = async function (body: any) {
      if (body?.skipResponseModifier) {
        originalJson(body);
      } else {
        const response: Partial<IResult> = {};
        if (res.isError) {
          response.data = body.data || null;
          if (!isEmpty(body.additionalData)) {
            response.additionalData = body.additionalData;
          }
          response.success = false;
          response.message = body.error.message;
          response.error = {
            description: body.error.message,
            statusCode: body.error.statusCode,
            errorType: body.error.errorType,
          };
        } else {
          response.data = body.data;
          response.success = true;
          if (body.pagination) {
            response.pagination = body.pagination;
          }
          if (body.additionalData) {
            response.additionalData = body.additionalData;
          }
          response.message = body.message || "Successfully executed";
        }
        originalJson(response);
      }
    };
    next();
  } catch (err) {
    next();
  }
};
