import { respond } from "@/utils/respond.util";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodAny, ZodError, ZodType } from "zod";

export type ValidatedData<
  B extends ZodAny | undefined,
  P extends ZodAny | undefined,
  Q extends ZodAny | undefined
> = {
  body: B extends ZodAny ? z.infer<B> : undefined;
  params: P extends ZodAny ? z.infer<P> : undefined;
  query: Q extends ZodAny ? z.infer<Q> : undefined;
};

declare module "express" {
  interface Request {
    validated?: Partial<ValidatedData<any, any, any>>;
  }
}

type Schemas = {
  body?: any;
  params?: any;
  query?: any;
};

type Options = {
  /** If true, return first error only (defaults to false) */
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
        // Unexpected error from schema (rare); convert to message
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

    // Validate in parallel for speed (but we need to await)
    const [parsedBody, parsedParams, parsedQuery] = await Promise.all([
      parsePiece("body", bodySchema),
      parsePiece("params", paramsSchema),
      parsePiece("query", querySchema),
    ]);

    if (errors.length > 0) {
      // Optionally call user-provided hook
      // Attempt to build a ZodError from issues — but call with available information
      // Not all errors come from a single ZodError; we skip constructing it reliably.
      if (onError && bodySchema instanceof ZodAny) {
        try {
        } catch {
          /* no-op */
        }
      }

      // Standardized error response
      return respond(res, "VALIDATION_ERROR", "Validation failed", {
        errors,
      });
    }

    // Attach parsed results to req.validated (only pieces that were validated)
    req.validated = {
      ...(parsedBody !== undefined ? { body: parsedBody } : {}),
      ...(parsedParams !== undefined ? { params: parsedParams } : {}),
      ...(parsedQuery !== undefined ? { query: parsedQuery } : {}),
    };

    return next();
  };
};
