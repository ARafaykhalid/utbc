import { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodAny, ZodError } from "zod";
import { respond } from "@/utils";

type Schemas = {
  body?: any;
  params?: any;
  query?: any;
};

type Options = {
  abortEarly?: boolean;
  onError?: (err: ZodError, req: Request, res: Response) => void;
};

export const validate = <
  B extends ZodAny = any,
  P extends ZodAny = any,
  Q extends ZodAny = any
>(
  schemas: Schemas,
  options?: Options
): RequestHandler => {
  const {
    body: bodySchema,
    params: paramsSchema,
    query: querySchema,
  } = schemas;
  const { abortEarly = false, onError } = options || {};

  return async (req: Request, res: Response, next: NextFunction) => {
    const errors: { path: string; message: string }[] = [];

    const parsePiece = async (
      pieceName: "body" | "params" | "query",
      schema?: ZodAny
    ) => {
      if (!schema) return undefined;
      try {
        const result = await schema.safeParseAsync(req[pieceName]);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            const path =
              issue.path && issue.path.length
                ? issue.path.map(String).join(".")
                : pieceName;
            errors.push({
              path: `${pieceName}${path ? "." + path : ""}`,
              message: issue.message,
            });
          });
          return undefined;
        }
        return result.data;
      } catch (err) {
        if (err instanceof ZodError) {
          err.issues.forEach((issue) =>
            errors.push({
              path: `${pieceName}${
                issue.path.length ? "." + issue.path.join(".") : ""
              }`,
              message: issue.message,
            })
          );
        } else {
          errors.push({
            path: pieceName,
            message: "Validation failed (internal error)",
          });
        }
        return undefined;
      }
    };

    const [parsedBody, parsedParams, parsedQuery] = await Promise.all([
      parsePiece("body", bodySchema),
      parsePiece("params", paramsSchema),
      parsePiece("query", querySchema),
    ]);

    if (errors.length > 0) {
      if (onError) {
        try {
          // optional hook: user provided
          // build a ZodError etc. (skipped here)
        } catch {
          /* no-op */
        }
      }

      return respond(res, "VALIDATION_ERROR", "Validation failed", {
        errors,
      });
    }

    req.validated = {
      ...(parsedBody !== undefined ? { body: parsedBody } : {}),
      ...(parsedParams !== undefined ? { params: parsedParams } : {}),
      ...(parsedQuery !== undefined ? { query: parsedQuery } : {}),
    };

    return next();
  };
};
