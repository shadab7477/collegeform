import mongoose from 'mongoose';

const formProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  formData: {
    type: Object,
    required: true
  },
  activeStep: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

formProgressSchema.index({ userId: 1, collegeId: 1 }, { unique: true });

const FormProgress = mongoose.model('FormProgress', formProgressSchema);

export default FormProgress;