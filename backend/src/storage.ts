import {
  users,
  intakeForms,
  healthMetrics,
  labResults,
  appointments,
  emergencyContacts,
  userSettings,
  achievements,
  userProgress,
  type User,
  type UpsertUser,
  type IntakeForm,
  type InsertIntakeForm,
  type HealthMetric,
  type InsertHealthMetric,
  type LabResult,
  type InsertLabResult,
  type Appointment,
  type InsertAppointment,
  type EmergencyContact,
  type InsertEmergencyContact,
  type UserSettings,
  type InsertUserSettings,
  type Achievement,
  type InsertAchievement,
  type UserProgress,
  type InsertUserProgress,
} from "../shared/schema.ts";
import { db } from "./db.ts";
import { eq, desc, and, gt } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;

  // Intake forms
  getIntakeForms(userId: string): Promise<IntakeForm[]>;
  createIntakeForm(form: InsertIntakeForm): Promise<IntakeForm>;
  updateIntakeForm(id: number, updates: Partial<IntakeForm>): Promise<IntakeForm>;
  completeIntakeForm(id: number): Promise<IntakeForm>;

  // Health metrics
  getHealthMetrics(userId: string): Promise<HealthMetric[]>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  getLatestHealthMetric(userId: string, metricType: string): Promise<HealthMetric | undefined>;

  // Lab results
  getLabResults(userId: string): Promise<LabResult[]>;
  createLabResult(result: InsertLabResult): Promise<LabResult>;

  // Appointments
  getAppointments(userId: string): Promise<Appointment[]>;
  getUpcomingAppointments(userId: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;

  // Emergency contacts
  getEmergencyContacts(userId: string): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  updateEmergencyContact(id: number, updates: Partial<EmergencyContact>): Promise<EmergencyContact>;
  deleteEmergencyContact(id: number): Promise<void>;

  // User settings
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;

  // Achievements and gamification
  getAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievementProgress(userId: string, badgeId: string, progress: number): Promise<Achievement>;
  unlockAchievement(userId: string, badgeId: string): Promise<Achievement>;

  // User progress
  getUserProgress(userId: string): Promise<UserProgress | undefined>;
  upsertUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserStats(userId: string, formsCompleted: number, points: number): Promise<UserProgress>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Intake forms
  async getIntakeForms(userId: string): Promise<IntakeForm[]> {
    return await db
      .select()
      .from(intakeForms)
      .where(eq(intakeForms.userId, userId))
      .orderBy(intakeForms.dueDate);
  }

  async createIntakeForm(form: InsertIntakeForm): Promise<IntakeForm> {
    const [intakeForm] = await db
      .insert(intakeForms)
      .values(form)
      .returning();
    return intakeForm;
  }

  async updateIntakeForm(id: number, updates: Partial<IntakeForm>): Promise<IntakeForm> {
    const [intakeForm] = await db
      .update(intakeForms)
      .set(updates)
      .where(eq(intakeForms.id, id))
      .returning();
    return intakeForm;
  }

  async completeIntakeForm(id: number): Promise<IntakeForm> {
    const [intakeForm] = await db
      .update(intakeForms)
      .set({ 
        status: "completed",
        completedAt: new Date()
      })
      .where(eq(intakeForms.id, id))
      .returning();
    return intakeForm;
  }

  // Health metrics
  async getHealthMetrics(userId: string): Promise<HealthMetric[]> {
    return await db
      .select()
      .from(healthMetrics)
      .where(eq(healthMetrics.userId, userId))
      .orderBy(desc(healthMetrics.recordedAt));
  }

  async createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric> {
    const [healthMetric] = await db
      .insert(healthMetrics)
      .values(metric)
      .returning();
    return healthMetric;
  }

  async getLatestHealthMetric(userId: string, metricType: string): Promise<HealthMetric | undefined> {
    const [metric] = await db
      .select()
      .from(healthMetrics)
      .where(and(eq(healthMetrics.userId, userId), eq(healthMetrics.metricType, metricType)))
      .orderBy(desc(healthMetrics.recordedAt))
      .limit(1);
    return metric;
  }

  // Lab results
  async getLabResults(userId: string): Promise<LabResult[]> {
    return await db
      .select()
      .from(labResults)
      .where(eq(labResults.userId, userId))
      .orderBy(desc(labResults.testDate));
  }

  async createLabResult(result: InsertLabResult): Promise<LabResult> {
    const [labResult] = await db
      .insert(labResults)
      .values(result)
      .returning();
    return labResult;
  }

  // Appointments
  async getAppointments(userId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.scheduledAt));
  }

  async getUpcomingAppointments(userId: string): Promise<Appointment[]> {
    const now = new Date();
    return await db
      .select()
      .from(appointments)
      .where(and(
        eq(appointments.userId, userId), 
        eq(appointments.status, "scheduled"),
        gt(appointments.scheduledAt, now)
      ))
      .orderBy(appointments.scheduledAt);
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  // Emergency contacts
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    return await db
      .select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.userId, userId))
      .orderBy(desc(emergencyContacts.isPrimary));
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const [emergencyContact] = await db
      .insert(emergencyContacts)
      .values(contact)
      .returning();
    return emergencyContact;
  }

  async updateEmergencyContact(id: number, updates: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const [emergencyContact] = await db
      .update(emergencyContacts)
      .set(updates)
      .where(eq(emergencyContacts.id, id))
      .returning();
    return emergencyContact;
  }

  async deleteEmergencyContact(id: number): Promise<void> {
    await db
      .delete(emergencyContacts)
      .where(eq(emergencyContacts.id, id));
  }

  // User settings
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [userSetting] = await db
      .insert(userSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          ...settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return userSetting;
  }

  // Achievements and gamification
  async getAchievements(userId: string): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.earnedAt));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db
      .insert(achievements)
      .values(achievement)
      .returning();
    return newAchievement;
  }

  async updateAchievementProgress(userId: string, badgeId: string, progress: number): Promise<Achievement> {
    const [updatedAchievement] = await db
      .update(achievements)
      .set({ progress })
      .where(and(eq(achievements.userId, userId), eq(achievements.badgeId, badgeId)))
      .returning();
    return updatedAchievement;
  }

  async unlockAchievement(userId: string, badgeId: string): Promise<Achievement> {
    const [unlockedAchievement] = await db
      .update(achievements)
      .set({ 
        isUnlocked: true,
        earnedAt: new Date()
      })
      .where(and(eq(achievements.userId, userId), eq(achievements.badgeId, badgeId)))
      .returning();
    return unlockedAchievement;
  }

  // User progress
  async getUserProgress(userId: string): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
    return progress;
  }

  async upsertUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [userProgressRecord] = await db
      .insert(userProgress)
      .values(progress)
      .onConflictDoUpdate({
        target: userProgress.userId,
        set: {
          ...progress,
          updatedAt: new Date(),
        },
      })
      .returning();
    return userProgressRecord;
  }

  async updateUserStats(userId: string, formsCompleted: number, points: number): Promise<UserProgress> {
    const existingProgress = await this.getUserProgress(userId);
    
    const newTotalForms = (existingProgress?.totalFormsCompleted || 0) + formsCompleted;
    const newTotalPoints = (existingProgress?.totalPoints || 0) + points;
    const newExperiencePoints = (existingProgress?.experiencePoints || 0) + points;
    
    // Calculate level based on experience points (every 100 XP = 1 level)
    const newLevel = Math.floor(newExperiencePoints / 100) + 1;
    
    // Update streak logic
    const today = new Date();
    const lastActivity = existingProgress?.lastActivityDate;
    let newCurrentStreak = 1;
    
    if (lastActivity) {
      const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 1) {
        newCurrentStreak = (existingProgress?.currentStreak || 0) + 1;
      } else if (daysDiff > 1) {
        newCurrentStreak = 1;
      } else {
        newCurrentStreak = existingProgress?.currentStreak || 1;
      }
    }
    
    const newLongestStreak = Math.max(newCurrentStreak, existingProgress?.longestStreak || 0);

    return await this.upsertUserProgress({
      userId,
      totalFormsCompleted: newTotalForms,
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      totalPoints: newTotalPoints,
      level: newLevel,
      experiencePoints: newExperiencePoints,
      lastActivityDate: today,
    });
  }
}

export const storage = new DatabaseStorage();
