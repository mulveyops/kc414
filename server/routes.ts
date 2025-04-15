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
    
    // Email configuration
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'New Booking Request',
      text: `
        New booking request received:
        
        Name: ${result.data.name}
        Email: ${result.data.email}
        Date: ${result.data.date}
        Service Type: ${result.data.type}
        Message: ${result.data.message}
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: "Booking saved but email notification failed" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    const result = insertContactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid contact data" });
    }
    const message = await storage.createContactMessage(result.data);
    res.status(201).json(message);
  });

  app.post("/api/orders", async (req, res) => {
    const { name, email, phone, address, notes } = req.body;
    
    // Email configuration
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const cartItems = req.body.cartItems || [];
    const total = cartItems.reduce((sum: number, item: any) => sum + Number(item.price), 0);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'New Merchandise Order',
      text: `
        New order received:
        
        Customer Information:
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Shipping Address: ${address}
        Additional Notes: ${notes}

        Total Order Value: $${total.toFixed(2)}
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(201).json({ message: "Order received" });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: "Failed to process order" });
    }
  });

  return httpServer;
}