import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import logger from "@logger";

const validateBodySchema = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((error) => {
          const [code, message] = error.message.split("/");

          return {
            code,
            message,
          };
        });

        logger.error(
          {
            errors: error.errors,
            message: "Invalid data",
            body: req.body,
          },
          "Validation error",
        );

        res.status(parseInt(errors[0]?.code ?? "500")).json({
          success: false,
          error: {
            message_error: errors[0]?.message,
          },
        });
      } else {
        res.status(500).json({ success: false, error: { message_error: "Internal Server Error", notify: false } });
      }
    }
  };
};

const validateQuerySchema = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((error) => {
          const [code, message] = error.message.split("/");

          return {
            code,
            message,
          };
        });

        logger.error(
          {
            errors: error.errors,
            message: "Invalid data",
            query: req.query,
          },
          "Validation error",
        );

        res.status(parseInt(errors[0]?.code ?? "500")).json({
          success: false,
          error: {
            message_error: errors[0]?.message,
          },
        });
      } else {
        res.status(500).json({ success: false, error: { message_error: "Internal Server Error", notify: false } });
      }
    }
  };
};

const validateParamsSchema = (schema: z.ZodObject<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((error) => {
          const [code, message] = error.message.split("/");

          return {
            code,
            message,
          };
        });

        logger.error(
          {
            errors: error.errors,
            message: "Invalid data",
            params: req.params,
          },
          "Validation error",
        );

        res.status(parseInt(errors[0]?.code ?? "500")).json({
          success: false,
          error: {
            message_error: errors[0]?.message,
          },
        });
      } else {
        res.status(500).json({ success: false, error: { message_error: "Internal Server Error", notify: false } });
      }
    }
  };
};

export { validateBodySchema, validateQuerySchema, validateParamsSchema };
