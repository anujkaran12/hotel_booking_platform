import { Response } from "express";

export interface FieldError {
  field: string;
  message: string;
}

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown = null,
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors: FieldError[] = [],
): void => {
  const response: {
    success: boolean;
    message: string;
    errors?: FieldError[];
  } = {
    success: false,
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

export const validationResponse = (
  res: Response,
  errors: FieldError[],
): void => {
  errorResponse(res, 400, "Validation failed", errors);
};
