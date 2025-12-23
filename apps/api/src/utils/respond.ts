import { Response } from "express";
import { statusCodeMap } from "@shared/constants/httpStatus";
import { httpStatusCode } from "@shared/types/httpStatusCode";

export type FieldError = { path: string; message: string };
export type RespondOptions<T = any> = {
  data?: T;
  errors?: FieldError[] | Record<string, string>;
};

export const respond = <T = any>(
  res: Response,
  code: httpStatusCode,
  message: string,
  options?: RespondOptions<T>
) => {
  const status = statusCodeMap[code] || 500;

  const responseBody: any = {
    code,
    message,
    data: options?.data ?? undefined,
  };

  if (options?.errors) {
    if (Array.isArray(options.errors)) {
      responseBody.errors = options.errors;
    } else {
      // convert { field: msg } -> [{ path, message }]
      responseBody.errors = Object.entries(options.errors).map(
        ([path, msg]) => ({ path, message: msg })
      );
    }
  }

  return res.status(status).json(responseBody);
};
