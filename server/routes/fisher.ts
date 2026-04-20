import { Router, Response } from "express";
import { supabaseAdmin } from "../supabase";
import { authMiddleware, requireFisher, AuthenticatedRequest } from "../middleware/auth";
import { fisherProfileSchema, catchSchema } from "../../shared/schema";

const router = Router();

router.use(authMiddleware);
router.use(requireFisher);

router.get("/profile", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("fisher_profiles")
      .select("*")
      .eq("user_id", req.user!.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.json({ profile: null });
      }
      throw error;
    }

    res.json({ profile: data });
  } catch (error) {
    console.error("Get fisher profile error:", error);
    res.status(500).json({ message: "Failed to get profile" });
  }
});

router.put("/profile", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validation = fisherProfileSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { data: existingProfile } = await supabaseAdmin
      .from("fisher_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    const profileData = {
      user_id: req.user!.id,
      boat_name: validation.data.boatName,
      boat_type: validation.data.boatType,
      license_number: validation.data.licenseNumber,
      fishing_zone: validation.data.fishingZone,
      years_experience: validation.data.yearsExperience,
      catch_capacity: validation.data.catchCapacity,
      country: validation.data.country,
      region: validation.data.region,
      port: validation.data.port,
      bio: validation.data.bio,
      updated_at: new Date().toISOString(),
    };

    let data, error;

    if (existingProfile) {
      const result = await supabaseAdmin
        .from("fisher_profiles")
        .update(profileData)
        .eq("user_id", req.user!.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      const result = await supabaseAdmin
        .from("fisher_profiles")
        .insert({
          ...profileData,
          is_verified: false,
          total_catches: 0,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      throw error;
    }

    res.json({ message: "Profile updated", profile: data });
  } catch (error) {
    console.error("Update fisher profile error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

router.get("/catches", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: profile } = await supabaseAdmin
      .from("fisher_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!profile) {
      return res.json({ catches: [] });
    }

    const { data, error } = await supabaseAdmin
      .from("catches")
      .select("*")
      .eq("fisher_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ catches: data || [] });
  } catch (error) {
    console.error("Get catches error:", error);
    res.status(500).json({ message: "Failed to get catches" });
  }
});

router.get("/catches/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const { data: profile } = await supabaseAdmin
      .from("fisher_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!profile) {
      return res.status(400).json({ message: "Please complete your profile first" });
    }

    const { data, error } = await supabaseAdmin
      .from("catches")
      .select("*")
      .eq("id", id)
      .eq("fisher_id", profile.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ message: "Catch not found" });
      }
      throw error;
    }

    res.json({ catch: data });
  } catch (error) {
    console.error("Get catch error:", error);
    res.status(500).json({ message: "Failed to get catch" });
  }
});

router.post("/catches", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validation = catchSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    let { data: profile } = await supabaseAdmin
      .from("fisher_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!profile) {
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from("fisher_profiles")
        .insert({
          user_id: req.user!.id,
          country: "Kenya",
          is_verified: false,
          total_catches: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (createError) {
        console.error("Failed to auto-create fisher profile:", createError);
        return res.status(400).json({ message: "Please complete your profile before adding catches. Go to Profile page to set up your fisher profile." });
      }
      profile = newProfile;
    }

    const catchData = {
      fisher_id: profile.id,
      species: validation.data.species,
      quantity: validation.data.quantity,
      unit: validation.data.unit,
      price_per_unit: validation.data.pricePerUnit,
      currency: validation.data.currency,
      quality: validation.data.quality,
      catch_date: validation.data.catchDate,
      location: validation.data.location,
      description: validation.data.description,
      image_urls: validation.data.imageUrls,
      is_available: true,
    };

    const { data, error } = await supabaseAdmin
      .from("catches")
      .insert(catchData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const { data: currentProfile } = await supabaseAdmin
      .from("fisher_profiles")
      .select("total_catches")
      .eq("id", profile.id)
      .single();
    
    await supabaseAdmin
      .from("fisher_profiles")
      .update({ 
        total_catches: (currentProfile?.total_catches || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);

    res.status(201).json({ message: "Catch created", catch: data });
  } catch (error) {
    console.error("Create catch error:", error);
    res.status(500).json({ message: "Failed to create catch" });
  }
});

router.put("/catches/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validation = catchSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    const { data: profile } = await supabaseAdmin
      .from("fisher_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!profile) {
      return res.status(400).json({ message: "Please complete your profile first" });
    }

    const { data: existingCatch } = await supabaseAdmin
      .from("catches")
      .select("id")
      .eq("id", id)
      .eq("fisher_id", profile.id)
      .single();

    if (!existingCatch) {
      return res.status(404).json({ message: "Catch not found" });
    }

    const updateData = {
      species: validation.data.species,
      quantity: validation.data.quantity,
      unit: validation.data.unit,
      price_per_unit: validation.data.pricePerUnit,
      currency: validation.data.currency,
      quality: validation.data.quality,
      catch_date: validation.data.catchDate,
      location: validation.data.location,
      description: validation.data.description,
      image_urls: validation.data.imageUrls,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("catches")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ message: "Catch updated", catch: data });
  } catch (error) {
    console.error("Update catch error:", error);
    res.status(500).json({ message: "Failed to update catch" });
  }
});

router.delete("/catches/:id", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: profile } = await supabaseAdmin
      .from("fisher_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!profile) {
      return res.status(400).json({ message: "Please complete your profile first" });
    }

    const { error } = await supabaseAdmin
      .from("catches")
      .delete()
      .eq("id", id)
      .eq("fisher_id", profile.id);

    if (error) {
      throw error;
    }

    res.json({ message: "Catch deleted" });
  } catch (error) {
    console.error("Delete catch error:", error);
    res.status(500).json({ message: "Failed to delete catch" });
  }
});

router.get("/orders", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: profile } = await supabaseAdmin
      .from("fisher_profiles")
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
        buyer:buyer_profiles (
          id,
          company_name,
          business_type,
          user:users (first_name, last_name, email)
        )
      `)
      .eq("fisher_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ orders: data || [] });
  } catch (error) {
    console.error("Get fisher orders error:", error);
    res.status(500).json({ message: "Failed to get orders" });
  }
});

router.put("/orders/:id/status", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const { data: profile } = await supabaseAdmin
      .from("fisher_profiles")
      .select("id")
      .eq("user_id", req.user!.id)
      .single();

    if (!profile) {
      return res.status(400).json({ message: "Please complete your profile first" });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("fisher_id", profile.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ message: "Order status updated", order: data });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

router.get("/stats", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { data: profile } = await supabaseAdmin
      .from("fisher_profiles")
      .select("*")
      .eq("user_id", req.user!.id)
      .single();

    if (!profile) {
      return res.json({
        stats: {
          totalCatches: 0,
          activeCatches: 0,
          totalOrders: 0,
          pendingOrders: 0,
          rating: 0,
          isVerified: false,
        },
      });
    }

    const { count: totalCatches } = await supabaseAdmin
      .from("catches")
      .select("*", { count: "exact", head: true })
      .eq("fisher_id", profile.id);

    const { count: activeCatches } = await supabaseAdmin
      .from("catches")
      .select("*", { count: "exact", head: true })
      .eq("fisher_id", profile.id)
      .eq("is_available", true);

    const { count: totalOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("fisher_id", profile.id);

    const { count: pendingOrders } = await supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("fisher_id", profile.id)
      .in("status", ["pending", "confirmed", "processing"]);

    res.json({
      stats: {
        totalCatches: totalCatches || 0,
        activeCatches: activeCatches || 0,
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        rating: profile.rating || 0,
        isVerified: profile.is_verified,
      },
    });
  } catch (error) {
    console.error("Get fisher stats error:", error);
    res.status(500).json({ message: "Failed to get stats" });
  }
});

export default router;
