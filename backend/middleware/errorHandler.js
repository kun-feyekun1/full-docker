"use strict";

module.exports = (err, req, res, next) => {
  // Default error values
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Standard API error response
  const errorResponse = {
    success: false,
    message,
  };

  // Include stack trace only in development mode
  if (process.env.NODE_ENV !== "production") {
    errorResponse.stack = err.stack;
    errorResponse.path = req.originalUrl;
    errorResponse.method = req.method;
  }

  console.error(
    `🔥 Error (${statusCode}) - ${req.method} ${req.originalUrl}:`,
    message
  );

  res.status(statusCode).json(errorResponse);
};
