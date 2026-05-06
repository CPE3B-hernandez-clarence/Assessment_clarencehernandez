import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastRequestedAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // Document will automatically be deleted after 5 minutes (300 seconds)
    },
  },
  {
    timestamps: true,
  }
);

const EmailVerification = mongoose.model('EmailVerification', emailVerificationSchema);

export default EmailVerification;