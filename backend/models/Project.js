import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    predictionData: { type: mongoose.Schema.Types.Mixed }, // whatever AI returns
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productCount: [
      {
        name: { type: String, required: true },
        count: { type: Number, default: 0 },
      },
    ],
    vehicleNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
