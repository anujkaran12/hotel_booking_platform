import { User } from "../../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/auth";
import { LoginInput, RegisterInput } from "./auth.types";

// Register
export const register = async (input: RegisterInput) => {
  const { name, email, password, role, phone } = input;

  // check if email already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("An account with this email already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
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

// Login
export const login = async (input: LoginInput) => {
  const { email, password } = input;

  // check user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("No account found with this email");
  }

  // check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect password, please try again");
  }

  // generate token
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

// Get My Profile
export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new Error("User account not found");
  }
  return user;
};
