import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAchievement extends Document {
  userId: Types.ObjectId;
  badgeType: "form_completion" | "streak" | "milestone" | "recovery_progress";
  badgeId: string;
  title: string;
  description?: string;
  iconName: string;
  color: string;
  earnedAt: Date;
  progress: number;
  target: number;
  isUnlocked: boolean;
}

const achievementSchema = new Schema<IAchievement>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    badgeType: {
      type: String,
      required: true,
      enum: ["form_completion", "streak", "milestone", "recovery_progress"],
    },
    badgeId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    iconName: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      required: true,
    },
    isUnlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAchievement>("Achievement", achievementSchema);
