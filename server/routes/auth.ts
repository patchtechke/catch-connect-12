import { Router, Request, Response } from "express";
import { supabaseAdmin, isSupabaseConfigured } from "../supabase";
import { authMiddleware, AuthenticatedRequest } from "../middleware/auth";
import { registerSchema, loginSchema } from "../../shared/schema";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ message: "Database not configured" });
    }

    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { email, password, firstName, lastName, role, phoneNumber } = validation.data;

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error("Auth error:", authError);
      if (authError.message.includes("already registered")) {
        return res.status(409).json({ message: "Email already registered" });
      }
      return res.status(400).json({ message: authError.message });
    }

    if (!authData.user) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    const { error: userError } = await supabaseAdmin.from("users").insert({
      id: authData.user.id,
      email,
      role,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber || null,
      is_active: true,
    });

    if (userError) {
      console.error("User insert error:", userError);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ message: "Failed to create user profile" });
    }

    if (role === "fisher") {
      const { error: profileError } = await supabaseAdmin.from("fisher_profiles").insert({
        user_id: authData.user.id,
        country: "Kenya",
        is_verified: false,
        total_catches: 0,
      });

      if (profileError) {
        console.error("Fisher profile error:", profileError);
      }
    } else if (role === "buyer") {
      const { error: profileError } = await supabaseAdmin.from("buyer_profiles").insert({
        user_id: authData.user.id,
        business_type: "Retail",
        country: "Kenya",
        is_verified: false,
        total_orders: 0,
      });

      if (profileError) {
        console.error("Buyer profile error:", profileError);
      }
    }

    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      return res.status(201).json({ 
        message: "Account created. Please log in.",
        userId: authData.user.id,
      });
    }

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: authData.user.id,
        email,
        role,
        firstName,
        lastName,
      },
      session: {
        accessToken: signInData.session.access_token,
        refreshToken: signInData.session.refresh_token,
        expiresAt: signInData.session.expires_at,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ message: "Database not configured" });
    }

    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { email, password } = validation.data;

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!data.user || !data.session) {
      return res.status(401).json({ message: "Login failed" });
    }

    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (userError || !userData) {
      return res.status(401).json({ message: "User profile not found" });
    }

    if (!userData.is_active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    res.json({
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        firstName: userData.first_name,
        lastName: userData.last_name,
        phoneNumber: userData.phone_number,
        avatarUrl: userData.avatar_url,
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/logout", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const token = req.supabaseToken;
    
    if (token) {
      await supabaseAdmin.auth.admin.signOut(token);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.json({ message: "Logged out" });
  }
});

router.get("/me", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    let profile = null;

    if (req.user.role === "fisher") {
      const { data } = await supabaseAdmin
        .from("fisher_profiles")
        .select("*")
        .eq("user_id", req.user.id)
        .single();
      profile = data;
    } else if (req.user.role === "buyer") {
      const { data } = await supabaseAdmin
        .from("buyer_profiles")
        .select("*")
        .eq("user_id", req.user.id)
        .single();
      profile = data;
    }

    res.json({
      user: req.user,
      profile,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    res.json({
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
      },
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ message: "Token refresh failed" });
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ message: "Database not configured" });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { data: userData } = await supabaseAdmin
      .from("users")
      .select("id, is_active")
      .eq("email", email)
      .single();

    if (!userData) {
      return res.json({ message: "If an account exists with this email, a password reset link has been sent." });
    }

    if (!userData.is_active) {
      return res.json({ message: "If an account exists with this email, a password reset link has been sent." });
    }

    const redirectUrl = process.env.VITE_APP_URL 
      ? `${process.env.VITE_APP_URL}/reset-password`
      : `${req.protocol}://${req.get('host')}/reset-password`;

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error("Password reset error:", error);
    }

    res.json({ message: "If an account exists with this email, a password reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to process password reset request" });
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ message: "Database not configured" });
    }

    const { accessToken, newPassword } = req.body;

    if (!accessToken || !newPassword) {
      return res.status(400).json({ message: "Access token and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const { data: { user }, error: verifyError } = await supabaseAdmin.auth.getUser(accessToken);

    if (verifyError || !user) {
      return res.status(401).json({ message: "Invalid or expired reset link. Please request a new password reset." });
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (updateError) {
      console.error("Password update error:", updateError);
      return res.status(400).json({ message: "Failed to update password. Please try again." });
    }

    res.json({ message: "Password has been reset successfully. You can now log in with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

router.post("/seed-admin", async (req: Request, res: Response) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ message: "Database not configured" });
    }

    const { email, password, firstName, lastName, seedKey } = req.body;

    if (!process.env.ADMIN_SEED_KEY) {
      return res.status(503).json({ message: "Admin seeding not configured" });
    }

    if (!seedKey || seedKey !== process.env.ADMIN_SEED_KEY) {
      return res.status(403).json({ message: "Invalid seed key" });
    }

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists" });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error("Admin auth error:", authError);
      return res.status(400).json({ message: authError.message });
    }

    if (!authData.user) {
      return res.status(500).json({ message: "Failed to create admin user" });
    }

    const { error: userError } = await supabaseAdmin.from("users").insert({
      id: authData.user.id,
      email,
      role: "admin",
      first_name: firstName,
      last_name: lastName,
      is_active: true,
    });

    if (userError) {
      console.error("Admin user insert error:", userError);
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({ message: "Failed to create admin profile" });
    }

    res.status(201).json({
      message: "Admin user created successfully",
      userId: authData.user.id,
      email,
    });
  } catch (error) {
    console.error("Admin seed error:", error);
    res.status(500).json({ message: "Failed to seed admin" });
  }
});

export default router;
