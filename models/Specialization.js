
import mongoose from 'mongoose';

const SpecializationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
});

const Specialization = mongoose.model('Specialization', SpecializationSchema);
export default Specialization;