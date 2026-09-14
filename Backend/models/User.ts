import mongoose, { Document, Model, Schema } from 'mongoose';
import Course from './Courses';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string; 
  avatar: string;
  matricNumber?: string; 
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  authProvider: 'local';
  role: 'Student' | 'Professor' | 'Admin';
  registeredCourses: mongoose.Types.ObjectId[];
  hasPaidFees: boolean;
  department: string;
  program?: string; // <-- Fixed the comma and made it optional
}

export interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullName: { type: String, required: [true, 'Please add a name'] },
    email: { type: String, required: [true, 'Please add an email'], unique: true },
    password: { type: String },
    matricNumber: { type: String, unique: true, sparse: true },
    department: { type: String, default: null },
    avatar: { type: String, default: null },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpire: { type: Date, required: false },
    authProvider: { type: String, enum: ['local'], default: 'local' },
    role: { type: String, enum: ['Student', 'Professor', 'Admin'], default: 'Student' },
    registeredCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    hasPaidFees: {type: Boolean, default: false}, // <-- Switched to default: false so signup doesn't crash
    program: { type: String, enum: ['OND', 'Professional'], default: null },
  }, 
  { timestamps: true }
);

// --- THE NEW MATRIC NUMBER GENERATOR ---
userSchema.pre('save', async function () {
  // If the user already has a matric number (or is an Admin/Professor being updated), skip.
  if (!this.isNew || this.matricNumber || this.role !== 'Student') {
    return;
  }

  const currentYear = new Date().getFullYear();

  // Find the last student registered THIS YEAR so the sequence resets to 0001 every January
  const lastUser = await mongoose.model('User').findOne({
    role: 'Student',
    createdAt: { $gte: new Date(`${currentYear}-01-01`) }
  }).sort({ createdAt: -1 });

  let nextSequence = 1;
  
  if (lastUser && lastUser.matricNumber) {
    const parts = lastUser.matricNumber.split('/');
    const lastNumberString = parts[parts.length - 1]; // Always grabs the sequence, no matter the prefix length
    const lastNumber = parseInt(lastNumberString, 10);
    
    if (!isNaN(lastNumber)) {
      nextSequence = lastNumber + 1;
    }
  }

  const paddedNumber = nextSequence.toString().padStart(4, '0');
  
  // Since students don't pick their program at signup, issue them a "Provisional" prefix.
  // The Admin dashboard will overwrite this with OND/ or PROF/ when assigning them a track.
  let prefix = 'PROV'; 
  if (this.program === 'OND') prefix = 'OND';
  if (this.program === 'Professional') prefix = 'PROF';

  this.matricNumber = `${prefix}/${currentYear}/${paddedNumber}`;
});

userSchema.methods.matchPassword = async function(this: IUser, enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password!); 
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);
export default User;