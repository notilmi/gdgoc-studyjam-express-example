// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import { StatusCodes } from "http-status-codes";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid request data" });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Internal Server Error" });
      }
    }
  };
}
