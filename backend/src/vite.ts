import * as express from "express";
import type { Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";

// Vite-related logic removed because Vite is no longer a dependency.

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Stub functions to avoid breaking imports elsewhere
export async function setupVite(app: Express, server: Server) {
  // Vite setup removed
  log("Vite setup is not available (Vite removed)", "vite");
}

export function serveStatic(app: Express) {
  // Static serving removed
  log("Static serving is not available (Vite removed)", "vite");
}
