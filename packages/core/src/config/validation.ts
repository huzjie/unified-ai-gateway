import { z } from 'zod';

/** 校验失败错误 */
export class ValidationError extends Error {
  readonly issues: z.ZodIssue[];

  constructor(message: string, issues: z.ZodIssue[]) {
    super(message);
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

/** 校验并返回；失败抛 ValidationError */
export function validateOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError('配置校验失败', result.error.issues);
  }
  return result.data;
}
