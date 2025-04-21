import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertContactSchema, Product } from "@shared/schema";
import type { TransportOptions } from "nodemailer";

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
      
      // Send confirmation to customer
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

  app.post("/api/contact", async (req, res) => {
    const result = insertContactSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid contact data" });
    }
    const message = await storage.createContactMessage(result.data);
    res.status(201).json(message);
  });

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
      
      // Validate required fields
      if (!name || !email || !address) {
        return res.status(400).json({ 
          message: "Missing required fields",
          details: "Name, email and address are required" 
        });
      }
      
      // Ensure we have items in the order
      const orderItems = items || [];
      if (!orderItems.length) {
        return res.status(400).json({ 
          message: "Empty order",
          details: "No items in cart" 
        });
      }
      
      // Calculate total on server side as well (for verification)
      const calculatedTotal = orderItems.reduce((sum: number, item: any) => sum + Number(item.price), 0);
      
      // Format cart items for email
      const cartItemsDetails = orderItems.map((item: any) => 
        `- ${item.name} (Size: ${item.selectedSize || 'N/A'}) - $${Number(item.price).toFixed(2)}`
      ).join('\n');
      
      // Email configuration - when available
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
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
          to: process.env.RECIPIENT_EMAIL || email, // Fallback to customer email if recipient not set
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
          
          // Send confirmation to customer
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
          // Continue processing order even if email fails
        }
      } else {
        console.log('Email credentials not configured - skipping email notifications');
      }
      
      // Store order in memory (would be in database in production)
      const timestamp = new Date().toISOString();
      const orderSummary = {
        id: `order-${Date.now()}`,
        ...orderData,
        items: orderItems,
        total: calculatedTotal,
        date: timestamp
      };
      
      console.log('Order received:', orderSummary);
      
      // Return success response
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