import { rateLimit } from "express-rate-limit";

export const generalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  message: {
    success: false,
    message: "Too many login/register attempts, please try again later",
  },
});

export const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  message: {
    success: false,
    message: "Too many payment requests, please try again later",
  },
});
