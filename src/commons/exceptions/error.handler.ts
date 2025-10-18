import type { ErrorRequestHandler } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const errorHandler : ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const statusCode: number = (err.status as number) || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};