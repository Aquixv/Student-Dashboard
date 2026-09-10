import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  matricNumber: { type: String, required: true },
  courseCode: { type: String, required: true },
  score: { type: Number, required: true },
  grade: { type: String, required: true }
});

export default mongoose.model('Result', resultSchema);