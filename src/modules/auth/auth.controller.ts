import { Request, Response } from "express";
import * as authService from "./auth.service";
import {
  errorResponse,
  successResponse,
  validationResponse,
} from "../../utils/apiResponse";
import { getAuthUser } from "../../utils/request";
import {
  isValidEmail,
  isValidRole,
  requiredFields,
} from "../../utils/validation";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const errors = requiredFields(req.body, {
      name: "Name is required",
      email: "Email is required",
      password: "Password is required",
      role: "Role is required",
    });

    if (email && !isValidEmail(email)) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    }

    if (password && password.length < 6) {
      errors.push({
        field: "password",
        message: "Password must be at least 6 characters",
      });
    }

    if (role && !isValidRole(role)) {
      errors.push({
        field: "role",
        message: "Role must be customer, seller or admin",
      });
    }

    if (errors.length) {
      validationResponse(res, errors);
      return;
    }

    const result = await authService.register({
      name,
      email,
      password,
      role,
      phone,
    });

    successResponse(res, 201, "Account created successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const errors = requiredFields(req.body, {
      email: "Email is required",
      password: "Password is required",
    });

    if (email && !isValidEmail(email)) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address",
      });
    }

    if (errors.length) {
      validationResponse(res, errors);
      return;
    }

    const result = await authService.login({ email, password });
    successResponse(res, 200, "Login successful", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const result = await authService.getMe(getAuthUser(req).id);
    successResponse(res, 200, "Profile fetched successfully", result);
  } catch (err: any) {
    errorResponse(res, 400, err.message);
  }
};
