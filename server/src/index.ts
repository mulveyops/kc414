import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic, log } from "./vite"; // Removed setupVite (dev only)
import dotenv from "dotenv";
dotenv.config();

console.log("🔥 server/index.ts is running...");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS headers
app.use((req, res, next) => {
  // Accept requests from the frontend (e.g., kc414-frontend.onrender.com)
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Log all incoming requests to help debugging
  console.log(`Incoming request: ${req.method} ${req.url}`);
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(`Error: ${message}`); // Log error for Render logs
  });

  // Serve static assets in production (optional, if frontend assets are in server/public)
  serveStatic(app); // Keep this if you want to serve static files from server/public

  // Use Render's assigned port
  const port = process.env.PORT || 3000; // Fallback to 3000 for local development
  console.log('Starting server on port', port);
  
  // Attempt to listen on all available interfaces with detailed error handling
  try {
    server.listen({
      port: Number(port),
      host: "0.0.0.0",
    }, () => {
      console.log(`✅ Server running at http://0.0.0.0:${port}`);
      log(`serving on port ${port} from host 0.0.0.0`);
    });
    
    // Add error handling for the server
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Try using a different port.`);
      } else {
        console.error(`❌ Server error: ${error.message}`);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error}`);
    process.exit(1);
  }
})();