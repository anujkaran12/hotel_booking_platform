import { User } from "../../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/auth";
import { LoginInput, RegisterInput } from "./auth.types";

export const register = async (input: RegisterInput) => {
  const { name, email, password, role, phone } = input;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    phone,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const login = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No account found with this email");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password, please try again");
  }

  const token = generateToken({ id: user._id.toString(), role: user.role });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User account not found");
  }
  return user;
};
