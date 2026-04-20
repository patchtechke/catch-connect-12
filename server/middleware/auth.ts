import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../supabase";
import type { UserRole, User } from "../../shared/schema";

export interface AuthenticatedRequest extends Request {
  user?: User;
  supabaseToken?: string;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No authorization token provided" });
    }

    const token = authHeader.split(" ")[1];
    
    const { data: { user: authUser }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !authUser) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (userError || !userData) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!userData.is_active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    req.user = {
      id: userData.id,
      email: userData.email,
      role: userData.role as UserRole,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phoneNumber: userData.phone_number,
      avatarUrl: userData.avatar_url,
      isActive: userData.is_active,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    };
    req.supabaseToken = token;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Authentication failed" });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required roles: ${roles.join(", ")}` 
      });
    }

    next();
  };
}

export function requireFisher(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  return requireRole("fisher", "admin")(req, res, next);
}

export function requireBuyer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  return requireRole("buyer", "admin")(req, res, next);
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  return requireRole("admin")(req, res, next);
}
