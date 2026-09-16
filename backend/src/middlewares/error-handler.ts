import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/errors.js";

interface ErrorBody {
  message: string;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json({ message: err.message } satisfies ErrorBody);
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({ message: "Malformed JSON" } satisfies ErrorBody);
    return;
  }

  console.error(err);

  const body: ErrorBody = { message: "Internal server error" };
  res.status(500).json(body);
}
