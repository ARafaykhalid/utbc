import { Response } from "express";
import { statusCodeMap } from "@shared/constants/httpStatus";
import { httpStatusCode } from "@shared/types/httpStatusCode";
import { logger } from "@/lib/winston";

export type FieldError = { path: string; message: string };

export type RespondOptions<T = any> = {
  data?: T;
  errors?: FieldError[] | Record<string, string>;
};

const isInternalServerError = (code: httpStatusCode) =>
  code === "INTERNAL_SERVER_ERROR";

const formatErrors = (
  errors?: FieldError[] | Record<string, string>
): FieldError[] | undefined => {
  if (!errors) return undefined;
  if (Array.isArray(errors)) return errors;
  return Object.entries(errors).map(([path, msg]) => ({
    path,
    message: msg,
  }));
};

export const respond = <T = any>(
  res: Response,
  code: httpStatusCode,
  message: string,
  options?: RespondOptions<T>
) => {
  const status = statusCodeMap[code] || 500;

  const formattedErrors = formatErrors(options?.errors);

  /** -----------------------
   *  CLIENT RESPONSE
   *  ---------------------- */
  const responseBody: any = {
    code,
    message: isInternalServerError(code)
      ? "Something went wrong. Please try again later."
      : message,
    data: options?.data ?? undefined,
  };

  // never expose internal errors to client
  if (!isInternalServerError(code) && formattedErrors) {
    responseBody.errors = formattedErrors;
  }

  /** -----------------------
   *  SERVER LOGGING
   *  ---------------------- */
  const errorSummary =
    formattedErrors && formattedErrors.length
      ? formattedErrors.map((e) => `${e.path}: ${e.message}`).join(" | ")
      : "";

  const headline =
    code === "SUCCESS"
      ? `[API SUCCESS] ${status} – ${message}`
      : `[API ERROR] ${status} – ${message}${
          errorSummary ? ` → ${errorSummary}` : ""
        }`;

  const logPayload = {
    status,
    code,
    message,
    data: options?.data,
    errors: formattedErrors,
    timestamp: new Date().toISOString(),
  };

  if (code === "SUCCESS") {
    logger.info(headline, logPayload);
  } else {
    logger.error(headline, logPayload);
  }

  return res.status(status).json(responseBody);
};
