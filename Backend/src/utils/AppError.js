
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;   // We only care about errors we throw ourselves

    // Capture the stack trace (very useful in development)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;