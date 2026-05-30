export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: "customer" | "seller" | "admin";
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
