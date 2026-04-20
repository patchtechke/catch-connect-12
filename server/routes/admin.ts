import { Router, Response } from "express";
import { supabaseAdmin } from "../supabase";
import { authMiddleware, requireAdmin, AuthenticatedRequest } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.get("/users", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role, isActive, limit = 50, offset = 0, search } = req.query;

    let query = supabaseAdmin
      .from("users")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (role) {
      query = query.eq("role", role);
    }
    if (isActive !== undefined) {
      query = query.eq("is_active", isActive === "true");
    }
    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({ 
      users: data || [],
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to get users" });
  }
});

router.get("/users/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile = null;
    if (user.role === "fisher") {
      const { data } = await supabaseAdmin
        .from("fisher_profiles")
        .select("*")
        .eq("user_id", id)
        .single();
      profile = data;
    } else if (user.role === "buyer") {
      const { data } = await supabaseAdmin
        .from("buyer_profiles")
        .select("*")
        .eq("user_id", id)
        .single();
      profile = data;
    }

    res.json({ user, profile });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
});

router.put("/users/:id/status", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" });
    }

    if (id === req.user!.id) {
      return res.status(400).json({ message: "Cannot deactivate your own account" });
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ message: `User ${isActive ? "activated" : "deactivated"}`, user: data });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ message: "Failed to update user status" });
  }
});

router.put("/users/:id/role", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["fisher", "buyer", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (id === req.user!.id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ message: "User role updated", user: data });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
});

router.post("/users/:id/send-password-reset", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("email, first_name, last_name, is_active")
      .eq("id", id)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userData.is_active) {
      return res.status(400).json({ message: "Cannot send password reset to deactivated user" });
    }

    const redirectUrl = process.env.VITE_APP_URL 
      ? `${process.env.VITE_APP_URL}/reset-password`
      : `${req.protocol}://${req.get('host')}/reset-password`;

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(userData.email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      console.error("Admin password reset error:", error);
      return res.status(500).json({ message: "Failed to send password reset email" });
    }

    res.json({ 
      message: `Password reset email sent to ${userData.email}`,
      user: {
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
      }
    });
  } catch (error) {
    console.error("Admin send password reset error:", error);
    res.status(500).json({ message: "Failed to send password reset email" });
  }
});

router.get("/fishers", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { isVerified, country, limit = 50, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from("fisher_profiles")
      .select(`
        *,
        user:users (id, email, first_name, last_name, phone_number, is_active, created_at)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (isVerified !== undefined) {
      query = query.eq("is_verified", isVerified === "true");
    }
    if (country) {
      query = query.eq("country", country);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({ 
      fishers: data || [],
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error("Get fishers error:", error);
    res.status(500).json({ message: "Failed to get fishers" });
  }
});

router.put("/fishers/:id/verify", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({ message: "isVerified must be a boolean" });
    }

    const { data, error } = await supabaseAdmin
      .from("fisher_profiles")
      .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ message: `Fisher ${isVerified ? "verified" : "unverified"}`, profile: data });
  } catch (error) {
    console.error("Verify fisher error:", error);
    res.status(500).json({ message: "Failed to verify fisher" });
  }
});

router.get("/buyers", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { isVerified, country, limit = 50, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from("buyer_profiles")
      .select(`
        *,
        user:users (id, email, first_name, last_name, phone_number, is_active, created_at)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (isVerified !== undefined) {
      query = query.eq("is_verified", isVerified === "true");
    }
    if (country) {
      query = query.eq("country", country);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({ 
      buyers: data || [],
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error("Get buyers error:", error);
    res.status(500).json({ message: "Failed to get buyers" });
  }
});

router.put("/buyers/:id/verify", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== "boolean") {
      return res.status(400).json({ message: "isVerified must be a boolean" });
    }

    const { data, error } = await supabaseAdmin
      .from("buyer_profiles")
      .update({ is_verified: isVerified, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ message: `Buyer ${isVerified ? "verified" : "unverified"}`, profile: data });
  } catch (error) {
    console.error("Verify buyer error:", error);
    res.status(500).json({ message: "Failed to verify buyer" });
  }
});

router.get("/orders", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from("orders")
      .select(`
        *,
        catches (*),
        fisher:fisher_profiles (
          id,
          boat_name,
          country,
          user:users (first_name, last_name, email)
        ),
        buyer:buyer_profiles (
          id,
          company_name,
          country,
          user:users (first_name, last_name, email)
        )
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({ 
      orders: data || [],
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Failed to get orders" });
  }
});

router.get("/catches", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { isAvailable, limit = 50, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from("catches")
      .select(`
        *,
        fisher:fisher_profiles (
          id,
          boat_name,
          country,
          is_verified,
          user:users (first_name, last_name, email)
        )
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (isAvailable !== undefined) {
      query = query.eq("is_available", isAvailable === "true");
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({ 
      catches: data || [],
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error("Get catches error:", error);
    res.status(500).json({ message: "Failed to get catches" });
  }
});

router.get("/stats", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { count: totalUsers } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: totalFishers } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "fisher");

    const { count: totalBuyers } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "buyer");

    const { count: activeUsers } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    const { count: verifiedFishers } = await supabaseAdmin
      .from("fisher_profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_verified", true);

    const { count: verifiedBuyers } = await supabaseAdmin
      .from("buyer_profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_verified", true);

    const { count: totalCatches } = await supabaseAdmin
      .from("catches")
      .select("*", { count: "exact", head: true });

    const { count: availableCatches } = await supabaseAdmin
      .from("catches")
      .select("*", { count: "exact", head: true })
      .eq("is_available", true);

    const { count: totalOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { count: pendingOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: completedOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "delivered");

    res.json({
      stats: {
        users: {
          total: totalUsers || 0,
          fishers: totalFishers || 0,
          buyers: totalBuyers || 0,
          active: activeUsers || 0,
        },
        verification: {
          verifiedFishers: verifiedFishers || 0,
          verifiedBuyers: verifiedBuyers || 0,
        },
        catches: {
          total: totalCatches || 0,
          available: availableCatches || 0,
        },
        orders: {
          total: totalOrders || 0,
          pending: pendingOrders || 0,
          completed: completedOrders || 0,
        },
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({ message: "Failed to get stats" });
  }
});

router.get("/reports/revenue", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let query = supabaseAdmin
      .from("orders")
      .select("total_price, currency, created_at, status")
      .eq("status", "delivered");

    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const totalRevenue = (data || []).reduce((sum, order) => sum + order.total_price, 0);
    const orderCount = data?.length || 0;

    res.json({
      report: {
        totalRevenue,
        orderCount,
        averageOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
        orders: data,
      },
    });
  } catch (error) {
    console.error("Get revenue report error:", error);
    res.status(500).json({ message: "Failed to get revenue report" });
  }
});

export default router;
