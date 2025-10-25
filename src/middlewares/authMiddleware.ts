import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../models/user";

// Authentication middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload & { id: string };

    // Find user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request (cast to IUser)
    req.user = user as IUser;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: (error as Error).message,
    });
  }
};

// Admin authorization middleware
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // cast req.user to IUser
  const user = req.user as IUser | undefined;

  if (user?.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Access denied, admin only" });
};
