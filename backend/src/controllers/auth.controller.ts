import { z } from "zod";
import { storage } from "../storage.ts";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { generateToken } from "../utils/generateToken.ts";

const signupSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().min(10),
  password: z.string().min(8),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
  });

export const signup = async (req, res) => {
  try {
    const userData = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(userData.email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 12);

    // Create user
    const user = await storage.createUser({
      id: nanoid(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      dateOfBirth: userData.dateOfBirth,
      phoneNumber: userData.phoneNumber,
      passwordHash,
      profileImageUrl: null,
    });
    console.log("user created", user);

    // Create session
    (req.session as any).userId = user.id;

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(400).json({ message: "Invalid signup data" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create session
    // (req.session as any).userId = user.id;
   const token =  generateToken(res, user.id);
   console.log("token from login",token);

    res.json({
        message: "Login successful",
        token: token,
      // user: {
      //   id: user.id,
      //   email: user.email,
      //   firstName: user.firstName,
      //   lastName: user.lastName,
      // },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ message: "Invalid login data" });
  }
};
export const logout = async (req, res) => {
  /* ... */
};
export const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user" });
  }
};
