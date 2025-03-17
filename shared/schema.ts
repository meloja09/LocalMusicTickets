import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  address: text("address"),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  phone: true,
  address: true,
});

// Artists
export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genre: text("genre").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
});

export const insertArtistSchema = createInsertSchema(artists).pick({
  name: true,
  genre: true,
  bio: true,
  imageUrl: true,
});

// Venues
export const venues = pgTable("venues", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  capacity: integer("capacity").notNull(),
  description: text("description"),
  amenities: text("amenities"),
  imageUrl: text("image_url"),
});

export const insertVenueSchema = createInsertSchema(venues).pick({
  name: true,
  location: true,
  address: true,
  capacity: true,
  description: true,
  amenities: true,
  imageUrl: true,
});

// Concerts
export const concerts = pgTable("concerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  imageUrl: text("image_url"),
  venueId: integer("venue_id").notNull(),
  artistId: integer("artist_id").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  status: text("status").notNull().default("upcoming"),
});

export const insertConcertSchema = createInsertSchema(concerts).pick({
  title: true,
  description: true,
  date: true,
  imageUrl: true,
  venueId: true,
  artistId: true,
  isFeatured: true,
  status: true,
});

// Ticket Types
export const ticketTypes = pgTable("ticket_types", {
  id: serial("id").primaryKey(),
  concertId: integer("concert_id").notNull(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  quantity: integer("quantity").notNull(),
  description: text("description"),
  section: text("section"),
  rowStart: integer("row_start"),
  rowEnd: integer("row_end"),
  seatsPerRow: integer("seats_per_row"),
  isReserved: boolean("is_reserved").default(false),
});

export const insertTicketTypeSchema = createInsertSchema(ticketTypes).pick({
  concertId: true,
  name: true,
  price: true,
  quantity: true,
  description: true,
  section: true,
  rowStart: true,
  rowEnd: true,
  seatsPerRow: true,
  isReserved: true,
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderDate: timestamp("order_date").notNull().defaultNow(),
  totalAmount: doublePrecision("total_amount").notNull(),
  status: text("status").notNull().default("completed"),
  paymentMethod: text("payment_method").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  totalAmount: true,
  paymentMethod: true,
});

// Order Items (Tickets)
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  ticketTypeId: integer("ticket_type_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: doublePrecision("unit_price").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  ticketTypeId: true,
  quantity: true,
  unitPrice: true,
});

// Category types
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  iconClass: text("icon_class").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  iconClass: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artists.$inferSelect;

export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Venue = typeof venues.$inferSelect;

export type InsertConcert = z.infer<typeof insertConcertSchema>;
export type Concert = typeof concerts.$inferSelect;

export type InsertTicketType = z.infer<typeof insertTicketTypeSchema>;
export type TicketType = typeof ticketTypes.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
