import express, { type Express } from "express";
import { type Server } from "http";

// Keep the log function for debugging
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Remove setupVite since it's development-only and not needed on Render
export async function setupVite(app: Express, server: Server) {
  // No-op in production; this function is only used in development
  console.log("setupVite is a no-op in production (Render)");
}

// Remove serveStatic since the frontend is deployed separately as a Static Site
export function serveStatic(app: Express) {
  // No-op in production; frontend is served by Render Static Site
  console.log("serveStatic is a no-op in production (Render)");
}