import { Router, Response } from "express";
import { supabaseAdmin } from "../supabase";
import { authMiddleware, requireBuyer, AuthenticatedRequest } from "../middleware/auth";
import { buyerProfileSchema, orderSchema, ratingSchema } from "../../shared/schema";

const router = Router();

router.use(authMiddleware);
router.use(requireBuyer);

router.get("/profile", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("buyer_profiles")
      .select("*")
      .eq("user_id", req.user!.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Profile not found" });
      }
      throw error;
    }

    res.json({ profile: data });
  } catch (error) {
    console.error("Get buyer profile error:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
});

router.put("/profile", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validation = buyerProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const profileData = {
      company_name: validation.data.companyName,
      business_type: validation.data.businessType,
      business_license: validation.data.businessLicense,
      country: validation.data.country,
      region: validation.data.region,
      address: validation.data.address,
      preferred_species: validation.data.preferredSpecies,
      min_order_quantity: validation.data.minOrderQuantity,
      max_order_quantity: validation.data.maxOrderQuantity,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("buyer_profiles")
      .update(profileData)
      .eq("user_id", req.user!.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ message: "Profile updated", profile: data });
  } catch (error) {
    console.error("Update buyer profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

router.get("/marketplace", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { species, country, quality, minPrice, maxPrice, minQuantity, limit = 50, offset = 0 } = req.query;

    let query = supabaseAdmin
      .from("catches")
      .select(`
        *,
        fisher:fisher_profiles (
          id,
          boat_name,
          port,
          country,
          rating,
          is_verified,
          user:users (first_name, last_name)
        )
      `)
      .eq("is_available", true)
      .order("created_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (species) {
      query = query.ilike("species", `%${species}%`);
    }
    if (quality) {
      query = query.ilike("quality", `%${quality}%`);
    }
    if (country) {
      query = query.eq("fisher.country", country);
    }
    if (minPrice) {
      query = query.gte("price_per_unit", Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte("price_per_unit", Number(maxPrice));
    }
    if (minQuantity) {
      query = query.gte("quantity", Number(minQuantity));
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
    console.error("Search marketplace error:", error);
    res.status(500).json({ message: "Failed to search marketplace" });
  }
});

router.get("/catches/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("catches")
      .select(`
        *,
        fisher:fisher_profiles (
          id,
          boat_name,
          boat_type,
          port,
          country,
          region,
          rating,
          is_verified,
          bio,
          user:users (first_name, last_name, email, phone_number)
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Catch not found" });
      }
      throw error;
    }

    res.json({ catch: data });
  } catch (error) {
    console.error("Get catch details error:", error);
    res.status(500).json({ message: "Failed to get catch details" });
  }
});

router.get("/orders", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: profile } = await supabaseAdmin
      .from("buyer_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!profile) {
      return res.json({ orders: [] });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        catches (*),
        fisher:fisher_profiles (
          id,
          boat_name,
          port,
          country,
          user:users (first_name, last_name, email, phone_number)
        )
      `)
      .eq("buyer_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const ordersWithRatingStatus = await Promise.all(
      (data || []).map(async (order: any) => {
        try {
          const { data: rating } = await supabaseAdmin
            .from("ratings")
            .select("id")
            .eq("order_id", order.id)
            .single();
          return { ...order, is_rated: !!rating };
        } catch {
          return { ...order, is_rated: false };
        }
      })
    );

    res.json({ orders: ordersWithRatingStatus });
  } catch (error) {
    console.error("Get buyer orders error:", error);
    res.status(500).json({ message: "Failed to get orders" });
  }
});

router.post("/orders", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validation = orderSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { data: buyerProfile } = await supabaseAdmin
      .from("buyer_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!buyerProfile) {
      return res.status(404).json({ message: "Buyer profile not found" });
    }

    const { data: catchData } = await supabaseAdmin
      .from("catches")
      .select("*, fisher:fisher_profiles(id)")
      .eq("id", validation.data.catchId)
      .eq("is_available", true)
      .single();

    if (!catchData) {
      return res.status(404).json({ message: "Catch not found or not available" });
    }

    if (validation.data.quantity > catchData.quantity) {
      return res.status(400).json({ message: "Requested quantity exceeds available quantity" });
    }

    const totalPrice = validation.data.quantity * catchData.price_per_unit;

    const orderData = {
      buyer_id: buyerProfile.id,
      fisher_id: catchData.fisher.id,
      catch_id: catchData.id,
      quantity: validation.data.quantity,
      total_price: totalPrice,
      currency: catchData.currency,
      status: "pending",
      delivery_address: validation.data.deliveryAddress,
      delivery_date: validation.data.deliveryDate,
      notes: validation.data.notes,
    };

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const newQuantity = catchData.quantity - validation.data.quantity;
    await supabaseAdmin
      .from("catches")
      .update({ 
        quantity: newQuantity,
        is_available: newQuantity > 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", catchData.id);

    res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
});

router.put("/orders/:id/cancel", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: buyerProfile } = await supabaseAdmin
      .from("buyer_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!buyerProfile) {
      return res.status(404).json({ message: "Buyer profile not found" });
    }

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("buyer_id", buyerProfile.id)
      .single();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    await supabaseAdmin.rpc("restore_catch_quantity", {
      p_catch_id: order.catch_id,
      p_quantity: order.quantity,
    });

    res.json({ message: "Order cancelled", order: data });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

router.get("/stats", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: profile } = await supabaseAdmin
      .from("buyer_profiles")
      .select("*")
      .eq("user_id", req.user!.id)
      .single();

    if (!profile) {
      return res.json({
        stats: {
          totalOrders: 0,
          activeOrders: 0,
          completedOrders: 0,
          isVerified: false,
        },
      });
    }

    const { count: totalOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("buyer_id", profile.id);

    const { count: activeOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("buyer_id", profile.id)
      .in("status", ["pending", "confirmed", "processing", "shipped"]);

    const { count: completedOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("buyer_id", profile.id)
      .eq("status", "delivered");

    res.json({
      stats: {
        totalOrders: totalOrders || 0,
        activeOrders: activeOrders || 0,
        completedOrders: completedOrders || 0,
        isVerified: profile.is_verified,
      },
    });
  } catch (error) {
    console.error("Get buyer stats error:", error);
    res.status(500).json({ message: "Failed to get stats" });
  }
});

router.post("/ratings", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validation = ratingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { data: buyerProfile } = await supabaseAdmin
      .from("buyer_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!buyerProfile) {
      return res.status(404).json({ message: "Buyer profile not found" });
    }

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("*, fisher_id")
      .eq("id", validation.data.orderId)
      .eq("buyer_id", buyerProfile.id)
      .eq("status", "delivered")
      .single();

    if (!order) {
      return res.status(404).json({ message: "Order not found or not eligible for rating. Order must be delivered." });
    }

    const { data: existingRating } = await supabaseAdmin
      .from("ratings")
      .select("id")
      .eq("order_id", validation.data.orderId)
      .single();

    if (existingRating) {
      return res.status(400).json({ message: "You have already rated this order" });
    }

    const ratingData = {
      order_id: validation.data.orderId,
      buyer_id: buyerProfile.id,
      fisher_id: order.fisher_id,
      rating: validation.data.rating,
      comment: validation.data.comment,
    };

    const { data: rating, error } = await supabaseAdmin
      .from("ratings")
      .insert(ratingData)
      .select()
      .single();

    if (error) {
      if (error.code === "42P01") {
        return res.status(500).json({ message: "Ratings table not set up yet. Please contact support." });
      }
      throw error;
    }

    const { data: allRatings } = await supabaseAdmin
      .from("ratings")
      .select("rating")
      .eq("fisher_id", order.fisher_id);

    if (allRatings && allRatings.length > 0) {
      const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
      await supabaseAdmin
        .from("fisher_profiles")
        .update({ rating: parseFloat(avgRating.toFixed(2)) })
        .eq("id", order.fisher_id);
    }

    res.status(201).json({ message: "Rating submitted", rating });
  } catch (error) {
    console.error("Submit rating error:", error);
    res.status(500).json({ message: "Failed to submit rating" });
  }
});

router.get("/ratings/:orderId", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId } = req.params;

    const { data: buyerProfile } = await supabaseAdmin
      .from("buyer_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!buyerProfile) {
      return res.status(404).json({ message: "Buyer profile not found" });
    }

    const { data: rating, error } = await supabaseAdmin
      .from("ratings")
      .select("*")
      .eq("order_id", orderId)
      .eq("buyer_id", buyerProfile.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.json({ rating: null });
      }
      if (error.code === "42P01") {
        return res.json({ rating: null });
      }
      throw error;
    }

    res.json({ rating });
  } catch (error) {
    console.error("Get rating error:", error);
    res.status(500).json({ message: "Failed to get rating" });
  }
});

export default router;
