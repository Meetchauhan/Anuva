import mongoose, { Document, Schema, Types } from "mongoose";

export interface IEmergencyContact extends Document {
  userId: Types.ObjectId;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

const emergencyContactSchema = new Schema<IEmergencyContact>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEmergencyContact>(
  "EmergencyContact",
  emergencyContactSchema
);
