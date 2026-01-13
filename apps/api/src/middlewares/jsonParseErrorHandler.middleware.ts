import { respond } from "@api/utils";
import { ErrorRequestHandler } from "express";

export const jsonParseErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  next
) => {
  
  const anyErr = err as any;

  if (
    err instanceof SyntaxError &&
    
    (anyErr.status === 400 || "body" in anyErr)
  ) {
    return respond(res, "BAD_REQUEST", "Invalid JSON payload", {
      errors: { body: `${anyErr.message}` || "Malformed JSON" },
    });
  }

  if (
    anyErr?.type === "entity.parse.failed" ||
    anyErr?.type === "entity.too.large"
  ) {
    return respond(res, "BAD_REQUEST", "Invalid JSON payload", {
      errors: { body: `${anyErr.message}` || "Malformed JSON" },
    });
  }

  
  return next(err);
};
