import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUserProgress extends Document {
  userId: Types.ObjectId;
  totalFormsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  level: number;
  experiencePoints: number;
  lastActivityDate?: Date;
}

const userProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    totalFormsCompleted: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    experiencePoints: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserProgress>(
  "UserProgress",
  userProgressSchema
);
