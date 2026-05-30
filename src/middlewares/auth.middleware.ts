import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";
import { AuthRequest } from "../utils/request";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token, access denied" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    (req as AuthRequest).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
