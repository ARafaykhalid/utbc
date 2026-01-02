import { Response } from "express";
import { HttpStatusCode } from "@shared/types";
import { logger } from "@/lib/winston.lib";
import { STATUS_CODE_MAP } from "@shared/constants";

export type FieldError = { path: string; message: string };

export type RespondOptions<T = any> = {
  data?: T;
  errors?: FieldError[] | Record<string, string>;
};

const isInternalServerError = (code: HttpStatusCode) =>
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
  code: HttpStatusCode,
  message: string,
  options?: RespondOptions<T>
) => {
  const status = STATUS_CODE_MAP[code] || 500;

  const formattedErrors = formatErrors(options?.errors);

  const responseBody: any = {
    code: code,
    message: isInternalServerError(code)
      ? "Something went wrong. Please try again later."
      : message,
    data: options?.data ?? undefined,
  };

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
