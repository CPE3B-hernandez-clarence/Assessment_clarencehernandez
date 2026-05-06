import mongoose from 'mongoose';

const contactSupportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: '_mail',
  }
);

const ContactSupport = mongoose.model('ContactSupport', contactSupportSchema);

export default ContactSupport;
