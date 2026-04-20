import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import authRoutes from "./routes/auth";
import fisherRoutes from "./routes/fisher";
import buyerRoutes from "./routes/buyer";
import adminRoutes from "./routes/admin";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { authMiddleware, AuthenticatedRequest } from "./middleware/auth";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `catch-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

interface WaitlistData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
  userType?: string;
  country?: string;
  description?: string;
}

interface WaitlistEntry extends WaitlistData {
  id: string;
  createdAt: string;
}

const waitlistStorage: WaitlistEntry[] = [];

export function registerRoutes(app: Express): Server {
  app.use("/api/auth", authRoutes);
  app.use("/api/fisher", fisherRoutes);
  app.use("/api/buyer", buyerRoutes);
  app.use("/api/admin", adminRoutes);

  app.use("/uploads", (req, res, next) => {
    res.setHeader("Cache-Control", "public, max-age=31536000");
    next();
  }, express.static(uploadDir));

  app.post("/api/upload", authMiddleware, upload.single("image"), (req: AuthenticatedRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl, filename: req.file.filename });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  app.post("/api/waitlist", async (req, res) => {
    try {
      const data: WaitlistData = req.body;

      if (!data.firstName || !data.lastName || !data.emailAddress) {
        return res.status(400).json({ 
          message: "First name, last name, and email are required" 
        });
      }

      const espoUrl = process.env.ESPOCRM_URL;
      const espoApiKey = process.env.ESPOCRM_API_KEY;

      console.log("CRM Config - URL exists:", !!espoUrl, "API Key exists:", !!espoApiKey);
      
      if (espoUrl && espoApiKey) {
        try {
          const leadPayload = {
            firstName: data.firstName,
            lastName: data.lastName,
            emailAddress: data.emailAddress,
            phoneNumber: data.phoneNumber || "",
            status: "New",
            description: buildDescription(data),
          };

          const baseUrl = espoUrl.endsWith('/') ? espoUrl.slice(0, -1) : espoUrl;
          const apiEndpoint = `${baseUrl}/api/v1/Lead`;
          console.log("Calling CRM API:", apiEndpoint);

          const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": espoApiKey,
            },
            body: JSON.stringify(leadPayload),
          });

          console.log("CRM API Response status:", response.status);

          if (response.ok) {
            const result = await response.json();
            console.log("Lead created successfully in CRM:", result.id);

            return res.status(201).json({ 
              message: "Successfully joined the waitlist!",
              leadId: result.id 
            });
          }

          if (response.status === 409) {
            return res.status(200).json({ 
              message: "You're already on our waitlist! We'll be in touch soon.",
              duplicate: true 
            });
          }

          const errorText = await response.text();
          console.error("EspoCRM API error:", response.status, errorText);
        } catch (crmError) {
          console.error("CRM connection failed, falling back to local storage:", crmError);
        }
      } else {
        console.log("CRM not configured - URL or API key missing");
      }

      const existingEntry = waitlistStorage.find(
        entry => entry.emailAddress.toLowerCase() === data.emailAddress.toLowerCase()
      );

      if (existingEntry) {
        console.log("Duplicate entry found in local storage:", data.emailAddress);
        return res.status(200).json({ 
          message: "You're already on our waitlist! We'll be in touch soon.",
          duplicate: true 
        });
      }

      const newEntry: WaitlistEntry = {
        ...data,
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };

      waitlistStorage.push(newEntry);
      console.log("Waitlist entry stored locally:", newEntry.id, data.emailAddress);

      res.status(201).json({ 
        message: "Successfully joined the waitlist!",
        leadId: newEntry.id 
      });
    } catch (error) {
      console.error("Waitlist signup error:", error);
      res.status(500).json({ 
        message: "Failed to join waitlist. Please try again later." 
      });
    }
  });

  app.get("/api/waitlist", async (req, res) => {
    res.json({ 
      entries: waitlistStorage,
      count: waitlistStorage.length 
    });
  });

  app.get("/api/health", async (req, res) => {
    const supabaseConfigured = isSupabaseConfigured();
    
    let supabaseConnected = false;
    if (supabaseConfigured) {
      try {
        const { error } = await supabaseAdmin.from("users").select("id").limit(1);
        supabaseConnected = !error;
      } catch {
        supabaseConnected = false;
      }
    }

    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        supabase: {
          configured: supabaseConfigured,
          connected: supabaseConnected,
        },
        espocrm: {
          configured: !!(process.env.ESPOCRM_URL && process.env.ESPOCRM_API_KEY),
        },
      },
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

function buildDescription(data: WaitlistData): string {
  const parts: string[] = [];
  
  if (data.userType) {
    const userTypeLabels: Record<string, string> = {
      fisher: "Fisher / Fishing Community",
      buyer: "Seafood Buyer / Importer",
      processor: "Fish Processor",
      retailer: "Restaurant / Retailer",
      investor: "Investor / Partner",
      ngo: "NGO / Development Organization",
      government: "Government / Regulator",
      other: "Other",
    };
    parts.push(`Role: ${userTypeLabels[data.userType] || data.userType}`);
  }
  
  if (data.country) {
    const countryLabels: Record<string, string> = {
      kenya: "Kenya",
      tanzania: "Tanzania",
      uganda: "Uganda",
      somalia: "Somalia",
      mozambique: "Mozambique",
      madagascar: "Madagascar",
      seychelles: "Seychelles",
      mauritius: "Mauritius",
      comoros: "Comoros",
      south_africa: "South Africa",
      ghana: "Ghana",
      nigeria: "Nigeria",
      senegal: "Senegal",
      other_africa: "Other African Country",
      international: "International",
    };
    parts.push(`Country: ${countryLabels[data.country] || data.country}`);
  }
  
  if (data.description) {
    parts.push(`\nAdditional Notes:\n${data.description}`);
  }
  
  parts.push(`\nSource: MarineCatch Africa Website Waitlist`);
  parts.push(`Signup Date: ${new Date().toISOString()}`);
  
  return parts.join("\n");
}
