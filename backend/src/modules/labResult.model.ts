import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILabResult extends Document {
  userId: Types.ObjectId;
  testName:
    | "ImPACT Test"
    | "MRI Scan"
    | "CT Scan"
    | "Neuropsychological Assessment"
    | "SCAT5"
    | "King-Devick Test";
  result: string;
  unit?: string;
  status: "normal" | "abnormal" | "concerning" | "follow_up_needed";
  testDate: Date;
}

const labResultSchema = new Schema<ILabResult>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    testName: {
      type: String,
      required: true,
      enum: [
        "ImPACT Test",
        "MRI Scan",
        "CT Scan",
        "Neuropsychological Assessment",
        "SCAT5",
        "King-Devick Test",
      ],
    },
    result: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["normal", "abnormal", "concerning", "follow_up_needed"],
    },
    testDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ILabResult>("LabResult", labResultSchema);
