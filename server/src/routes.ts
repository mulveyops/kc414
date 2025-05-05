import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertContactSchema, Product } from "@shared/schema";
import type { TransportOptions } from "nodemailer";
import cors from 'cors'; // Add CORS support
import express from 'express';

// Initialize Express app with middleware
export async function registerRoutes(app: Express) {
  // Enable CORS to allow frontend (e.g., kc414-frontend.onrender.com) to access backend
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Adjust based on your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  }));

  // Parse JSON bodies for POST/PUT requests
  app.use(express.json());

  const httpServer = createServer(app);

  // Products API
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

  // Tracks API
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

  // Bookings API
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
    } as TransportOptions); // Type assertion for Nodemailer

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || 'default@example.com', // Fallback to avoid crash
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
      
      const customerMailOptions = {
        from: process.env.EMAIL_USER,
        to: result.data.email,
        subject: 'Booking Confirmation - KC414',
        text: `
          Thank you for booking with KC414!
          
          We have received your booking request for:
          Date: ${result.data.date}
          Service Type: ${result.data.type}
          
          We will review your request and get back to you soon.
          
          Best regards,
          KC414 Team
        `
      };
      await transporter.sendMail(customerMailOptions);
      
      res.status(201).json(booking);
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: "Booking saved but email notification failed" });
    }
  });

  // Contact API
  app.post("/api/contact", async (req, res) => {
    const result = insertContactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid contact data" });
    }
    const message = await storage.createContactMessage(result.data);
    res.status(201).json(message);
  });

  // Orders API
  app.post("/api/orders", async (req, res) => {
    try {
      const { name, email, phone, address, notes, items, total } = req.body;
      
      const orderData = {
        name, 
        email,
        phone: phone || 'Not provided',
        address,
        notes: notes || 'None'
      };
      
      if (!name || !email || !address) {
        return res.status(400).json({ 
          message: "Missing required fields",
          details: "Name, email and address are required" 
        });
      }
      
      const orderItems = items || [];
      if (!orderItems.length) {
        return res.status(400).json({ 
          message: "Empty order",
          details: "No items in cart" 
        });
      }
      
      const calculatedTotal = orderItems.reduce((sum: number, item: any) => sum + Number(item.price), 0);
      
      const cartItemsDetails = orderItems.map((item: any) => 
        `- ${item.name} (Size: ${item.selectedSize || 'N/A'}) - $${Number(item.price).toFixed(2)}`
      ).join('\n');
      
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        const nodemailer = await import('nodemailer');
        const transporter = nodemailer.default.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        } as TransportOptions);

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.RECIPIENT_EMAIL || email,
          subject: 'New Merchandise Order',
          text: `
            New order received:
            
            Customer Information:
            Name: ${name}
            Email: ${email}
            Phone: ${phone || 'Not provided'}
            Shipping Address: ${address}
            Additional Notes: ${notes || 'None'}

            Order Details:
            ${cartItemsDetails}
            
            Total Order Value: $${calculatedTotal.toFixed(2)}
          `
        };

        try {
          await transporter.sendMail(mailOptions);
          
          const customerMailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Order Confirmation - KC414 Merchandise',
            text: `
              Thank you for your order with KC414!
              
              Order Details:
              ${cartItemsDetails}
              
              Total Amount: $${calculatedTotal.toFixed(2)}
              
              We will process your order and send you shipping information soon.
              
              Best regards,
              KC414 Team
            `
          };
          await transporter.sendMail(customerMailOptions);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      } else {
        console.log('Email credentials not configured - skipping email notifications');
      }
      
      const timestamp = new Date().toISOString();
      const orderSummary = {
        id: `order-${Date.now()}`,
        ...orderData,
        items: orderItems,
        total: calculatedTotal,
        date: timestamp
      };
      
      // Store order (in memory for now; replace with database in production)
      console.log('Order received:', orderSummary);
      
      res.status(201).json({ 
        message: "Order received successfully",
        orderId: orderSummary.id,
        timestamp
      });
    } catch (error) {
      console.error('Error processing order:', error);
      res.status(500).json({ 
        message: "Failed to process order",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  return httpServer;
}