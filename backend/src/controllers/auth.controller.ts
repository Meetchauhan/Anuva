import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { Request, Response } from "express";
import userModel from "../modules/user.model.js";
import { Types } from "mongoose";
import { signupSchema, loginSchema } from "../validations/user.validation.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const userData = signupSchema.parse(req.body);

    const existingUser = await userModel.findOne({ email: userData.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(userData.password, 12);

    const user = await userModel.create({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      dateOfBirth: userData.dateOfBirth,
      phoneNumber: userData.phoneNumber,
      passwordHash,
    });

    const token = generateToken(res, user._id as Types.ObjectId);

    return res.status(201).json({
      message: "Account created successfully",
      user,
      token,
    });
  } catch (error) {
    console.log("Signup error:", error);
    res.status(400).json({ message: "Invalid signup data" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await userModel.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(res, user._id as Types.ObjectId);

    return res.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(400).json({ message: "Invalid login data" });
  }
};
export const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};
export const getUser = async (req: Request, res: Response) => {
  try {
    if (!res.locals.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await userModel.findById(res.locals.user._id);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    return res.json({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get user" });
  }
};
