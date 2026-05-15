import type { Response } from "express";

type ResponseBody<T> = {
  success: boolean;
  message: string;
  data: T | null;
};

export class ApiResponse {
  static ok<T>(res: Response, message: string, data: T | null = null) {
    return res.status(200).json({
      success: true,
      message,
      data,
    } satisfies ResponseBody<T>);
  }

  static created<T>(res: Response, message: string, data: T | null = null) {
    return res.status(201).json({
      success: true,
      message,
      data,
    } satisfies ResponseBody<T>);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  static error(res: Response, statusCode: number, message: string, data = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      data,
    });
  }

  static badRequest(res: Response, message = "Bad request") {
    return ApiResponse.error(res, 400, message);
  }
}
