import {
  boolean,
  date,
  datetime,
  index,
  int,
  json,
  mediumtext,
  mysqlTable,
  primaryKey,
  serial,
  text,
  timestamp,
  tinyint,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

const createdAt = () => timestamp("created_at").notNull().defaultNow();
const updatedAt = () => timestamp("updated_at").notNull().defaultNow().onUpdateNow();

/** Money is always stored in cents. */
export const products = mysqlTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    price: int("price").notNull(),
    compareAt: int("compare_at"),
    short: varchar("short", { length: 300 }).notNull().default(""),
    description: text("description").notNull(),
    includes: json("includes").$type<string[]>().notNull(),
    categories: json("categories").$type<string[]>().notNull(),
    colors: json("colors").$type<string[]>().notNull(),
    images: json("images").$type<string[]>().notNull(),
    /** Next-day eligible (column keeps its original name "same_day"). False = needs one extra prep day. */
    nextDay: boolean("same_day").notNull().default(true),
    bestSeller: boolean("best_seller").notNull().default(false),
    featured: boolean("featured").notNull().default(false),
    hasSizes: boolean("has_sizes").notNull().default(true),
    badge: varchar("badge", { length: 40 }),
    active: boolean("active").notNull().default(true),
    sortOrder: int("sort_order").notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("products_slug_uq").on(t.slug)],
);

export const reviews = mysqlTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: int("product_id").notNull(),
    name: varchar("name", { length: 80 }).notNull(),
    email: varchar("email", { length: 190 }),
    rating: tinyint("rating").notNull(),
    title: varchar("title", { length: 120 }).notNull().default(""),
    body: text("body").notNull(),
    approved: boolean("approved").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [index("reviews_product_idx").on(t.productId, t.approved)],
);

export const customers = mysqlTable(
  "customers",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 190 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 30 }),
    passwordHash: varchar("password_hash", { length: 100 }).notNull(),
    marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("customers_email_uq").on(t.email)],
);

export const addresses = mysqlTable(
  "addresses",
  {
    id: serial("id").primaryKey(),
    customerId: int("customer_id").notNull(),
    label: varchar("label", { length: 60 }).notNull().default(""),
    recipientName: varchar("recipient_name", { length: 120 }).notNull(),
    recipientPhone: varchar("recipient_phone", { length: 30 }).notNull(),
    company: varchar("company", { length: 120 }),
    street: varchar("street", { length: 200 }).notNull(),
    apt: varchar("apt", { length: 60 }),
    city: varchar("city", { length: 80 }).notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    zip: varchar("zip", { length: 10 }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [index("addresses_customer_idx").on(t.customerId)],
);

export const wishlist = mysqlTable(
  "wishlist",
  {
    customerId: int("customer_id").notNull(),
    productId: int("product_id").notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.customerId, t.productId] })],
);

export const ORDER_STATUSES = ["pending_payment", "received", "processing", "out_for_delivery", "delivered", "cancelled", "refunded"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orders = mysqlTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 20 }).notNull(),
    accessToken: varchar("access_token", { length: 48 }).notNull(),
    customerId: int("customer_id"),
    status: varchar("status", { length: 24 }).$type<OrderStatus>().notNull().default("pending_payment"),
    paymentStatus: varchar("payment_status", { length: 16 }).$type<"unpaid" | "paid" | "refunded" | "failed">().notNull().default("unpaid"),
    senderName: varchar("sender_name", { length: 120 }).notNull(),
    senderEmail: varchar("sender_email", { length: 190 }).notNull(),
    senderPhone: varchar("sender_phone", { length: 30 }).notNull(),
    recipientName: varchar("recipient_name", { length: 120 }).notNull(),
    recipientPhone: varchar("recipient_phone", { length: 30 }).notNull(),
    company: varchar("company", { length: 120 }),
    addressType: varchar("address_type", { length: 20 }).notNull().default("residence"),
    street: varchar("street", { length: 200 }).notNull(),
    apt: varchar("apt", { length: 60 }),
    city: varchar("city", { length: 80 }).notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    zip: varchar("zip", { length: 10 }).notNull(),
    deliveryDate: date("delivery_date", { mode: "string" }).notNull(),
    deliveryWindow: varchar("delivery_window", { length: 20 }).notNull().default("anytime"),
    cardMessage: text("card_message"),
    cardSignature: varchar("card_signature", { length: 120 }),
    instructions: text("instructions"),
    subtotal: int("subtotal").notNull(),
    deliveryFee: int("delivery_fee").notNull().default(0),
    sameDayFee: int("same_day_fee").notNull().default(0),
    discount: int("discount").notNull().default(0),
    tax: int("tax").notNull().default(0),
    total: int("total").notNull(),
    couponCode: varchar("coupon_code", { length: 40 }),
    trackingCarrier: varchar("tracking_carrier", { length: 20 }),
    trackingNumber: varchar("tracking_number", { length: 60 }),
    stripeSessionId: varchar("stripe_session_id", { length: 255 }),
    stripePaymentIntent: varchar("stripe_payment_intent", { length: 255 }),
    adminNote: text("admin_note"),
    paidAt: datetime("paid_at"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("orders_code_uq").on(t.code),
    index("orders_customer_idx").on(t.customerId),
    index("orders_email_idx").on(t.senderEmail),
    index("orders_session_idx").on(t.stripeSessionId),
  ],
);

export type OrderAddOn = { key: string; label: string; price: number };

export const orderItems = mysqlTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: int("order_id").notNull(),
    productId: int("product_id"),
    slug: varchar("slug", { length: 160 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    image: varchar("image", { length: 255 }),
    size: varchar("size", { length: 20 }).notNull().default("standard"),
    sizeLabel: varchar("size_label", { length: 40 }).notNull().default("Standard"),
    addOns: json("add_ons").$type<OrderAddOn[]>().notNull(),
    unitPrice: int("unit_price").notNull(),
    quantity: int("quantity").notNull(),
    lineTotal: int("line_total").notNull(),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const coupons = mysqlTable(
  "coupons",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 40 }).notNull(),
    description: varchar("description", { length: 200 }).notNull().default(""),
    type: varchar("type", { length: 16 }).$type<"percent" | "fixed" | "free_delivery">().notNull(),
    value: int("value").notNull().default(0),
    minSubtotal: int("min_subtotal").notNull().default(0),
    maxUses: int("max_uses"),
    usedCount: int("used_count").notNull().default(0),
    startsAt: datetime("starts_at"),
    endsAt: datetime("ends_at"),
    active: boolean("active").notNull().default(true),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("coupons_code_uq").on(t.code)],
);

export const subscribers = mysqlTable(
  "subscribers",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 190 }).notNull(),
    source: varchar("source", { length: 40 }).notNull().default("footer"),
    unsubscribed: boolean("unsubscribed").notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("subscribers_email_uq").on(t.email)],
);

export const posts = mysqlTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    excerpt: varchar("excerpt", { length: 400 }).notNull().default(""),
    /** Markdown (headings, lists, links, bold/italic). */
    content: mediumtext("content").notNull(),
    cover: varchar("cover", { length: 255 }),
    category: varchar("category", { length: 60 }).notNull().default("Flower Guides"),
    author: varchar("author", { length: 80 }).notNull().default("FlowerVsFlorist Team"),
    status: varchar("status", { length: 12 }).$type<"published" | "draft">().notNull().default("published"),
    seoTitle: varchar("seo_title", { length: 200 }),
    seoDescription: varchar("seo_description", { length: 300 }),
    publishedAt: datetime("published_at").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("posts_slug_uq").on(t.slug), index("posts_status_idx").on(t.status, t.publishedAt)],
);

export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 190 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  topic: varchar("topic", { length: 60 }).notNull().default("General"),
  orderCode: varchar("order_code", { length: 20 }),
  body: text("body").notNull(),
  handled: boolean("handled").notNull().default(false),
  createdAt: createdAt(),
});

export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Coupon = typeof coupons.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
export type Message = typeof messages.$inferSelect;
