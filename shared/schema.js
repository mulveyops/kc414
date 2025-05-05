"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertContactSchema = exports.insertBookingSchema = exports.insertTrackSchema = exports.insertProductSchema = exports.contactMessages = exports.bookings = exports.products = exports.tracks = exports.orderFormSchema = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
exports.orderFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().min(1, "Address is required"),
    notes: zod_1.z.string().optional(),
});
exports.tracks = (0, pg_core_1.pgTable)("tracks", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    title: (0, pg_core_1.text)("title").notNull(),
    audioUrl: (0, pg_core_1.text)("audio_url").notNull(),
    coverUrl: (0, pg_core_1.text)("cover_url").notNull(),
    spotifyTrackId: (0, pg_core_1.text)("spotify_track_id"), // Added Spotify track ID
});
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    price: (0, pg_core_1.numeric)("price").notNull(),
    size: (0, pg_core_1.text)("size").notNull(),
    imageUrl: (0, pg_core_1.text)("image_url").notNull(),
    category: (0, pg_core_1.text)("category").notNull(),
    inStock: (0, pg_core_1.boolean)("in_stock").default(true),
    relatedTrackId: (0, pg_core_1.integer)("related_track_id"),
});
exports.bookings = (0, pg_core_1.pgTable)("bookings", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    date: (0, pg_core_1.text)("date").notNull(),
    type: (0, pg_core_1.text)("type").notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
});
exports.contactMessages = (0, pg_core_1.pgTable)("contact_messages", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
});
exports.insertProductSchema = (0, drizzle_zod_1.createInsertSchema)(exports.products).omit({
    id: true,
});
exports.insertTrackSchema = (0, drizzle_zod_1.createInsertSchema)(exports.tracks).omit({ id: true });
exports.insertBookingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.bookings).omit({
    id: true,
});
exports.insertContactSchema = (0, drizzle_zod_1.createInsertSchema)(exports.contactMessages).omit({
    id: true,
});
