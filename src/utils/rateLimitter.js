import rateLimit from "express-rate-limit";

export const rateLimiter = (maxRequests, timeWindow) => {
  return rateLimit({
    windowMs: timeWindow * 1000,
    max: maxRequests,
    keyGenerator: (req) => req.ip,
    handler: (req, res) => {
      // Custom error handle
      res.status(429).json({
        success: false,
        error: "Too many requests. Try again later.",
      });
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
