import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.get("/api/tracks", async (_req, res) => {
    const tracks = await storage.getTracks();
    res.json(tracks);
  });

  app.get("/api/tracks/:id", async (req, res) => {
    const track = await storage.getTrack(Number(req.params.id));
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    res.json(track);
  });

  app.get("/api/tracks/:id/products", async (req, res) => {
    const products = await storage.getRelatedProducts(Number(req.params.id));
    res.json(products);
  });

  app.post("/api/bookings", async (req, res) => {
    const result = insertBookingSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid booking data" });
    }
    const booking = await storage.createBooking(result.data);
    res.status(201).json(booking);
  });

  app.post("/api/contact", async (req, res) => {
    const result = insertContactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid contact data" });
    }
    const message = await storage.createContactMessage(result.data);
    res.status(201).json(message);
  });

  return httpServer;
}