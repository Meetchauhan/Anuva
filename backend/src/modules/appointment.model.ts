import mongoose, { Document, Schema } from "mongoose";

export interface IAppointment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  providerName: string;
  appointmentType:
    | "Neurologist Consultation"
    | "Concussion Baseline"
    | "Follow-up Assessment"
    | "Cognitive Testing"
    | "Return-to-Play Evaluation";
  scheduledAt: Date;
  status: "scheduled" | "completed" | "cancelled";
}

const appointmentSchema = new Schema<IAppointment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    providerName: {
      type: String,
      required: true,
    },
    appointmentType: {
      type: String,
      required: true,
      enum: [
        "Neurologist Consultation",
        "Concussion Baseline",
        "Follow-up Assessment",
        "Cognitive Testing",
        "Return-to-Play Evaluation",
      ],
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAppointment>("Appointment", appointmentSchema);
