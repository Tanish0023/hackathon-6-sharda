import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

// Generate a JWT
export const generateToken = (payload: object, expiresIn = "1h") => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Verify a JWT
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
