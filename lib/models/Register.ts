import mongoose, { Schema, models } from 'mongoose'

const RegisterSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, 'Mobile must be 10 digits'],
      unique: true,
    },
    profession: { type: String, required: true },
    accompany: { type: String },
    regNum: { type: String, unique: true },
    generateQR: { type: Boolean, default: false },
    dayOne: {
      type: String,
    },

    dayTwo: {
      type: String,
    },
  },
  { timestamps: true },
)

export default models.Register || mongoose.model('Register', RegisterSchema)
