import { AppError } from "../errors/errors.js";
import type { Response } from "express";

export function handleControllerError(error: unknown, res: Response): Response {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
}
