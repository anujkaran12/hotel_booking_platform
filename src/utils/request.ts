import { Request } from "express";

export interface AuthUser {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const getAuthUser = (req: Request): AuthUser => {
  return (req as AuthRequest).user as AuthUser;
};

export const getParam = (req: Request, name: string): string => {
  return req.params[name] as string;
};

export const getQueryString = (
  req: Request,
  name: string,
): string | undefined => {
  const value = req.query[name];
  return typeof value === "string" ? value : undefined;
};
