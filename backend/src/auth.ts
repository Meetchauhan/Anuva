import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage.js";
import { User, InsertUser } from "../shared/schema.js";

// Extend the Express.User interface with our User type
declare global {
  namespace Express {
    interface User extends Omit<User, "password"> { 
      id: number;
      username: string;
      fullName: string;
      email: string;
      role: string;
    }
  }
}

const scryptAsync = promisify(scrypt);

  const pgStore = connectPgSimple(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: 7 * 24 * 60 * 60, // 1 week
    tableName: "sessions",
  });

  app.use(session({
    secret: process.env.SESSION_SECRET || 'healthcare-secret-key-development',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

/**
 * Hash a password with a random salt
 */
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

/**
 * Compare a plaintext password with a hashed one
 */
async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

/**
 * Middleware to check if user is authenticated
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
}

/**
 * Middleware to check if user has a specific role
 */
export function hasRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(res.locals.user.role)) {
      return res.status(403).json({ message: "Not authorized for this resource" });
    }

    next();
  };
}

/**
 * Set up authentication for the Express app
 */
export function setupAuth(app: Express) {
  // Session configuration
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "spinalhealth-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  };

  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up the local strategy for username/password login
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Incorrect username or password" });
        }
        
        const passwordMatch = await comparePasswords(password, user.password);
        
        if (!passwordMatch) {
          return done(null, false, { message: "Incorrect username or password" });
        }
        
        // Don't include the password in the user object
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize/deserialize user for session storage
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      
      if (!user) {
        return done(null, false);
      }
      
      // Don't include the password in the user object
      const { password: _, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });

  // Special endpoint for direct login with demo accounts
  app.post("/api/auth/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      
      // Special handling for demo accounts
      const demoAccounts = {
        "drchen": "password",
        "patient": "password",
        "caregiver": "password"
      };
      
      // Check if this is a demo account login attempt
      if (demoAccounts.hasOwnProperty(username) && demoAccounts[username as keyof typeof demoAccounts] === password) {
        console.log(`Demo account login attempt for ${username}`);
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return res.status(401).json({ message: "Invalid username or password" });
        }
        
        // Don't include the password in the user object
        const { password: _, ...userWithoutPassword } = user;
        
        // Log the user in through passport
        req.login(userWithoutPassword, (err) => {
          if (err) {
            return next(err);
          }
          
          return res.status(200).json(userWithoutPassword);
        });
      } else {
        // Regular passport authentication for non-demo accounts
        passport.authenticate("local", (err: Error, user: Express.User, info: { message: string }) => {
          if (err) {
            return next(err);
          }
          
          if (!user) {
            return res.status(401).json({ message: info.message || "Authentication failed" });
          }
          
          req.login(user, (err) => {
            if (err) {
              return next(err);
            }
            
            res.json(user);
          });
        })(req, res, next);
      }
    } catch (error) {
      next(error);
    }
  });
  
  // Authentication routes
  app.post("/api/auth/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash the password
      const hashedPassword = await hashPassword(req.body.password);
      
      // Create the user with hashed password
      const userToCreate: InsertUser = {
        ...req.body,
        password: hashedPassword,
      };
      
      const newUser = await storage.createUser(userToCreate);
      
      // Don't include the password in the response
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Log the user in
      req.login(userWithoutPassword, (err) => {
        if (err) {
          return next(err);
        }
        
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  // This endpoint was replaced by the one above

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.json(res.locals.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });
}