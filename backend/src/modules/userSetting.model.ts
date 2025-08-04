import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUserSetting extends Document {
  userId: Types.ObjectId;
  shareWithFamily: boolean;
  shareWithProviders: boolean;
  appointmentReminders: boolean;
  formReminders: boolean;
  testResultNotifications: boolean;
}

const userSettingSchema = new Schema<IUserSetting>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    shareWithFamily: {
      type: Boolean,
      default: false,
    },
    shareWithProviders: {
      type: Boolean,
      default: true,
    },
    appointmentReminders: {
      type: Boolean,
      default: true,
    },
    formReminders: {
      type: Boolean,
      default: true,
    },
    testResultNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserSetting>("UserSetting", userSettingSchema);
