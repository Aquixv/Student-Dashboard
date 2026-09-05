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
  role: 'Student' | 'Professor';
  registeredCourses: mongoose.Types.ObjectId[];
  hasPaidFees: boolean;
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
    matricNumber: { type: String, unique: true },
    avatar: { 
      type: String, 
      default: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1234567/default-avatar.png' 
    },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpire: { type: Date, required: false },
    authProvider: { type: String, enum: ['local'], default: 'local' },
    role: { type: String, enum: ['Student', 'Professor'], default: 'Student' },
    registeredCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    hasPaidFees: {type: Boolean, required: true}
  }, 
  { timestamps: true }
);
userSchema.pre('save', async function () {
  if (!this.isNew || this.matricNumber) {
    return;
  }

  const lastUser = await mongoose.model('User').findOne().sort({ createdAt: -1 });

  let nextSequence = 1;
  
  if (lastUser && lastUser.matricNumber) {
    const lastNumberString = lastUser.matricNumber.split('/')[1];
    const lastNumber = parseInt(lastNumberString, 10);
    
    if (!isNaN(lastNumber)) {
      nextSequence = lastNumber + 1;
    }
  }

  const paddedNumber = nextSequence.toString().padStart(4, '0');
  this.matricNumber = `OND/PROF/${paddedNumber}`;
});

userSchema.methods.matchPassword = async function(this: IUser, enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password!); 
};

const User = mongoose.model<IUser, UserModel>('User', userSchema);
export default User;