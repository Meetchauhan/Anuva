import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with custom authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  dateOfBirth: varchar("date_of_birth"),
  phoneNumber: varchar("phone_number"),
  passwordHash: varchar("password_hash"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Intake forms that patients need to complete - specialized for neurological care
export const intakeForms = pgTable("intake_forms", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  formType: varchar("form_type").notNull(), // 'concussion_baseline', 'post_injury_assessment', 'symptom_tracking', 'return_to_play', 'cognitive_evaluation'
  status: varchar("status").notNull().default("pending"), // 'pending', 'completed', 'overdue'
  priority: varchar("priority").notNull().default("normal"), // 'urgent', 'normal', 'low'
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health metrics for neurological analytics
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  metricType: varchar("metric_type").notNull(), // 'symptom_severity', 'cognitive_score', 'balance_test', 'reaction_time', 'headache_frequency', 'sleep_quality'
  value: text("value").notNull(), // JSON string for complex values or numeric scores
  unit: varchar("unit"), // 'score', 'ms', 'severity_1-10', 'hours', etc.
  recordedAt: timestamp("recorded_at").defaultNow(),
});

// Neurological test results and assessments
export const labResults = pgTable("lab_results", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  testName: varchar("test_name").notNull(), // 'ImPACT Test', 'MRI Scan', 'CT Scan', 'Neuropsychological Assessment', 'SCAT5', 'King-Devick Test'
  result: varchar("result").notNull(),
  unit: varchar("unit"),
  status: varchar("status").notNull(), // 'normal', 'abnormal', 'concerning', 'follow_up_needed'
  testDate: timestamp("test_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Neurological care appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  providerName: varchar("provider_name").notNull(),
  appointmentType: varchar("appointment_type").notNull(), // 'Neurologist Consultation', 'Concussion Baseline', 'Follow-up Assessment', 'Cognitive Testing', 'Return-to-Play Evaluation'
  scheduledAt: timestamp("scheduled_at").notNull(),
  status: varchar("status").notNull().default("scheduled"), // 'scheduled', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
});

// Emergency contacts
export const emergencyContacts = pgTable("emergency_contacts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  relationship: varchar("relationship").notNull(),
  phone: varchar("phone").notNull(),
  email: varchar("email"),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// User settings
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  shareWithFamily: boolean("share_with_family").default(false),
  shareWithProviders: boolean("share_with_providers").default(true),
  appointmentReminders: boolean("appointment_reminders").default(true),
  formReminders: boolean("form_reminders").default(true),
  testResultNotifications: boolean("test_result_notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Achievement badges for gamified progress tracking
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  badgeType: varchar("badge_type").notNull(), // 'form_completion', 'streak', 'milestone', 'recovery_progress'
  badgeId: varchar("badge_id").notNull(), // unique identifier for the specific badge
  title: varchar("title").notNull(),
  description: text("description"),
  iconName: varchar("icon_name").notNull(), // lucide icon name
  color: varchar("color").notNull(), // hex color for badge
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: integer("progress").default(0), // current progress towards badge
  target: integer("target").notNull(), // target needed to earn badge
  isUnlocked: boolean("is_unlocked").default(false),
});

// User progress statistics for gamification
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  totalFormsCompleted: integer("total_forms_completed").default(0),
  currentStreak: integer("current_streak").default(0), // consecutive days with activity
  longestStreak: integer("longest_streak").default(0),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  experiencePoints: integer("experience_points").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertIntakeForm = typeof intakeForms.$inferInsert;
export type IntakeForm = typeof intakeForms.$inferSelect;

export type InsertHealthMetric = typeof healthMetrics.$inferInsert;
export type HealthMetric = typeof healthMetrics.$inferSelect;

export type InsertLabResult = typeof labResults.$inferInsert;
export type LabResult = typeof labResults.$inferSelect;

export type InsertAppointment = typeof appointments.$inferInsert;
export type Appointment = typeof appointments.$inferSelect;

export type InsertEmergencyContact = typeof emergencyContacts.$inferInsert;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;

export type InsertUserSettings = typeof userSettings.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;

export type InsertAchievement = typeof achievements.$inferInsert;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserProgress = typeof userProgress.$inferInsert;
export type UserProgress = typeof userProgress.$inferSelect;

// Insert schemas
export const insertIntakeFormSchema = createInsertSchema(intakeForms).omit({
  id: true,
  createdAt: true,
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({
  id: true,
  recordedAt: true,
});

export const insertLabResultSchema = createInsertSchema(labResults).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
  createdAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
