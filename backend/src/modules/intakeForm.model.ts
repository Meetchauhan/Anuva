import mongoose, { Document, Schema, Types } from "mongoose";

export interface IIntakeForm extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  formType:
    | "concussion_baseline"
    | "post_injury_assessment"
    | "symptom_tracking"
    | "return_to_play"
    | "cognitive_evaluation";
  status: "pending" | "completed" | "overdue";
  priority: "urgent" | "normal" | "low";
  dueDate?: Date;
  completedAt?: Date;
}

const intakeFormSchema = new Schema<IIntakeForm>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    formType: {
      type: String,
      required: true,
      enum: [
        "concussion_baseline",
        "post_injury_assessment",
        "symptom_tracking",
        "return_to_play",
        "cognitive_evaluation",
      ],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending",
      required: true,
    },
    priority: {
      type: String,
      enum: ["urgent", "normal", "low"],
      default: "normal",
      required: true,
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IIntakeForm>("IntakeForm", intakeFormSchema);
