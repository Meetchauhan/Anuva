import jwt from "jsonwebtoken";
import { storage } from "../storage.js";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET;
export const is_logged_in = async (req:Request, res:Response, next:NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try { 
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    res.locals.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};