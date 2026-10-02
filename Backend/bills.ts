import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  targetDepartment: { type: String, default: 'Global' } 
});

export default mongoose.model('Bill', billSchema);