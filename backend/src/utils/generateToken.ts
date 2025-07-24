import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";

export const generateToken = (res:Response, userId:string) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  console.log("token from generateToken",token);
  res.cookie("jwt", token, {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  });
  return token;
};