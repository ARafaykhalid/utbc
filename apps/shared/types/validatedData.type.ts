import z, { ZodAny } from "zod";

export type ValidatedData<
  B extends ZodAny | undefined,
  P extends ZodAny | undefined,
  Q extends ZodAny | undefined
> = {
  body: B extends ZodAny ? z.infer<B> : undefined;
  params: P extends ZodAny ? z.infer<P> : undefined;
  query: Q extends ZodAny ? z.infer<Q> : undefined;
};
