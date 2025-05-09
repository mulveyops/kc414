import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  jsonb,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const orderFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  notes: z.string().optional(),
});

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  audioUrl: text("audio_url").notNull(),
  coverUrl: text("cover_url").notNull(),
  spotifyTrackId: text("spotify_track_id"), // Added Spotify track ID
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  size: text("size").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  inStock: boolean("in_stock").default(true),
  relatedTrackId: integer("related_track_id"),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(),
  message: text("message").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});
export const insertTrackSchema = createInsertSchema(tracks).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
});
export const insertContactSchema = createInsertSchema(contactMessages).omit({
  id: true,
});

export type Product = typeof products.$inferSelect;
export type Track = typeof tracks.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type InsertContactMessage = z.infer<typeof insertContactSchema>;
