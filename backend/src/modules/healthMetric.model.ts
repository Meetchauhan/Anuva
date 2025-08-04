import mongoose, { Document, Schema } from "mongoose";

export interface IHealthMetric extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  metricType:
    | "symptom_severity"
    | "cognitive_score"
    | "balance_test"
    | "reaction_time"
    | "headache_frequency"
    | "sleep_quality";
  value: string;
  unit?: string;
}

const healthMetricSchema = new Schema<IHealthMetric>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    metricType: {
      type: String,
      required: true,
      enum: [
        "symptom_severity",
        "cognitive_score",
        "balance_test",
        "reaction_time",
        "headache_frequency",
        "sleep_quality",
      ],
    },
    value: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IHealthMetric>(
  "HealthMetric",
  healthMetricSchema
);
