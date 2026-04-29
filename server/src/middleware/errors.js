export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found"
    }
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = Number(err?.status ?? 500);
  const code = err?.code ?? "INTERNAL_ERROR";
  const message = err?.message ?? "Unexpected server error";

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    error: { code, message }
  });
}

