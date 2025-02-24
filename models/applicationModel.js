import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    course: { type: String, required: true },
    collegeName: { type: String, required: true },
    location: { type: String, required: true },
    completed: { type: Boolean, default: false }, // ✅ New field for status

  note: { type: String, default: "" }, // Add the note field
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
