import { z } from "zod";

export type UserRole = "fisher" | "buyer" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FisherProfile {
  id: string;
  userId: string;
  boatName?: string;
  boatType?: string;
  licenseNumber?: string;
  fishingZone?: string;
  yearsExperience?: number;
  catchCapacity?: number;
  country: string;
  region?: string;
  port?: string;
  bio?: string;
  isVerified: boolean;
  rating?: number;
  totalCatches: number;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerProfile {
  id: string;
  userId: string;
  companyName?: string;
  businessType: string;
  businessLicense?: string;
  country: string;
  region?: string;
  address?: string;
  preferredSpecies?: string[];
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  isVerified: boolean;
  rating?: number;
  totalOrders: number;
  createdAt: string;
  updatedAt: string;
}

export interface Catch {
  id: string;
  fisherId: string;
  species: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  currency: string;
  quality: string;
  catchDate: string;
  location?: string;
  description?: string;
  imageUrls?: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  buyerId: string;
  fisherId: string;
  catchId: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  status: OrderStatus;
  deliveryAddress?: string;
  deliveryDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Rating {
  id: string;
  orderId: string;
  buyerId: string;
  fisherId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export const userRoles: UserRole[] = ["fisher", "buyer", "admin"];

export const orderStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["fisher", "buyer"]),
  phoneNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const fisherProfileSchema = z.object({
  boatName: z.string().optional(),
  boatType: z.string().optional(),
  licenseNumber: z.string().optional(),
  fishingZone: z.string().optional(),
  yearsExperience: z.number().min(0).optional(),
  catchCapacity: z.number().min(0).optional(),
  country: z.string().min(1, "Country is required"),
  region: z.string().optional(),
  port: z.string().optional(),
  bio: z.string().optional(),
});

export const buyerProfileSchema = z.object({
  companyName: z.string().optional(),
  businessType: z.string().min(1, "Business type is required"),
  businessLicense: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  region: z.string().optional(),
  address: z.string().optional(),
  preferredSpecies: z.array(z.string()).optional(),
  minOrderQuantity: z.number().min(0).optional(),
  maxOrderQuantity: z.number().min(0).optional(),
});

export const catchSchema = z.object({
  species: z.string().min(1, "Species is required"),
  quantity: z.number().min(0.1, "Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  pricePerUnit: z.number().min(0, "Price must be positive"),
  currency: z.string().default("USD"),
  quality: z.string().default("Standard"),
  catchDate: z.string(),
  location: z.string().optional(),
  description: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
});

export const orderSchema = z.object({
  catchId: z.string().min(1, "Catch ID is required"),
  quantity: z.number().min(0.1, "Quantity must be greater than 0"),
  deliveryAddress: z.string().optional(),
  deliveryDate: z.string().optional(),
  notes: z.string().optional(),
});

export const ratingSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type FisherProfileInput = z.infer<typeof fisherProfileSchema>;
export type BuyerProfileInput = z.infer<typeof buyerProfileSchema>;
export type CatchInput = z.infer<typeof catchSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type RatingInput = z.infer<typeof ratingSchema>;
