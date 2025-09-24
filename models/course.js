import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['UG', 'PG', 'Certification/Diploma'],
    default: 'UG'
  },
  specializations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Specialization'
  }]
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

export default Course;