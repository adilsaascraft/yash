import mongoose, { Schema, models } from 'mongoose'

const RegisterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{10}$/, 'Mobile must be 10 digits'],
    },

    regNum: {
      type: String,
      unique: true,
      required: true,
    },

    generateQR: {
      type: Boolean,
      default: false,
    },

    dayOne: {
      type: String,
      default: null,
    },

    dayTwo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

export default models.Register || mongoose.model('Register', RegisterSchema)
