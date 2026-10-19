import { z } from "zod";
import { US_STATES, addOns, deliveryWindows } from "./site";

const phone = z
  .string()
  .trim()
  .refine((v) => v.replace(/\D/g, "").length >= 10 && v.replace(/\D/g, "").length <= 15, "Enter a valid phone number");
const name = (label: string) => z.string().trim().min(2, `Enter the ${label}`).max(120);
const email = z.string().trim().toLowerCase().email("Enter a valid email address").max(190);

export const reviewSchema = z.object({
  productId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.union([email, z.literal("")]).optional(),
  title: z.string().trim().max(120).optional().default(""),
  body: z.string().trim().min(10, "Please write at least a sentence (10+ characters)").max(2000),
  website: z.string().optional(), // honeypot
});

export const newsletterSchema = z.object({ email, source: z.string().max(40).optional() });

export const contactSchema = z.object({
  name: name("your name"),
  email,
  phone: z.union([phone, z.literal("")]).optional(),
  topic: z.enum(["General question", "Order status", "Change an order", "Corporate & events", "Feedback"]),
  orderCode: z.string().trim().max(20).optional(),
  body: z.string().trim().min(10, "Please tell us a little more (10+ characters)").max(4000),
  website: z.string().optional(),
});

const stateCodes = US_STATES.map(([c]) => c) as [string, ...string[]];

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        size: z.string().max(20),
        addOns: z.array(z.enum(addOns.map((a) => a.key) as [string, ...string[]])).max(addOns.length),
        qty: z.number().int().min(1).max(20),
      }),
    )
    .min(1, "Your cart is empty")
    .max(30),
  senderName: name("your name"),
  senderEmail: email,
  senderPhone: phone,
  recipientName: name("recipient's name"),
  recipientPhone: phone,
  addressType: z.enum(["residence", "business", "hospital", "funeral_home", "church"]),
  company: z.string().trim().max(120).optional(),
  street: z.string().trim().min(4, "Enter the street address").max(200),
  apt: z.string().trim().max(60).optional(),
  city: z.string().trim().min(2, "Enter the city").max(80),
  state: z.enum(stateCodes, { message: "Choose a state" }),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit ZIP code"),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a delivery date"),
  deliveryWindow: z.enum(deliveryWindows.map((w) => w.value) as [string, ...string[]]),
  cardMessage: z.string().trim().max(300, "Card messages can be up to 300 characters").optional(),
  cardSignature: z.string().trim().max(120).optional(),
  instructions: z.string().trim().max(500).optional(),
  couponCode: z.string().trim().toUpperCase().max(40).optional(),
  agree: z.literal(true, { message: "Please accept the terms to continue" }),
  website: z.string().optional(),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const registerSchema = z.object({
  name: name("your name"),
  email,
  password: z.string().min(8, "Use at least 8 characters").max(100),
  marketing: z.boolean().optional(),
});

export const loginSchema = z.object({ email, password: z.string().min(1, "Enter your password").max(100) });

export const addressSchema = z.object({
  label: z.string().trim().max(60).optional(),
  recipientName: name("recipient's name"),
  recipientPhone: phone,
  company: z.string().trim().max(120).optional(),
  street: z.string().trim().min(4, "Enter the street address").max(200),
  apt: z.string().trim().max(60).optional(),
  city: z.string().trim().min(2, "Enter the city").max(80),
  state: z.enum(stateCodes, { message: "Choose a state" }),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit ZIP code"),
});

/** zod issues -> { field: firstMessage } */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    out[key] ??= issue.message;
  }
  return out;
}
