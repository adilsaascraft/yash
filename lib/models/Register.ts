import mongoose, { Schema, models } from "mongoose";

const RegisterSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile must be 10 digits"],
      unique: true,
    },
    gender: { type: String, required: true },
    profession: { type: String, required: true },
    visitingDay: { type: String, required: true },
    regNum: { type: String, unique: true },
    generateQR: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Register || mongoose.model("Register", RegisterSchema);