import { Request, Response, NextFunction } from "express";
import { getAuthUser } from "../utils/request";

export const roleMiddleware = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = getAuthUser(req).role;

    if (!roles.includes(userRole)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    next();
  };
};
