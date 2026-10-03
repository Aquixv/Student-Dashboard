import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  isGlobal: { type: Boolean, default: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Null means everyone sees it
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notifications', notificationSchema);