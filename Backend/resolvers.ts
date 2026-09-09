import User from './models/User';
import Course from './models/Courses';
import  generateToken  from './config/GenerateToken';
import bcrypt from 'bcryptjs';
import Transactions from './models/Transactions';

export const resolvers = {
  Query: {
   me: async (_parent: any, _args: any, context: any) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    const user = await User.findById(context.user.id).populate('registeredCourses');
    return user;
  },
    availableCourses: async () => await Course.find(),
  },

  Mutation: {
    login: async (_parent: any, { email, password }: any) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Invalid email or password');
      }
      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }

      return {
        token: generateToken(user.id),
        user
      };
    },
  updateFeeStatus: async (_parent: any, { userId, status, reference }: any, context: any) => {
    if (!context.user) throw new Error('Not authenticated');

    // 1. Create the Receipt/Transaction record
    await Transactions.create({
      user: userId,
      reference: reference,
      amount: 140000, 
      description: 'Harmattan Semester Mandatory Fees',
      status: 'success'
    });

    // 2. Unlock the portal for the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { hasPaidFees: status } },
      { new: true }
    );

    return updatedUser;
  },
    registerUser: async (_parent: any, { fullName, email, password }: any) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate a random 4-digit ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedMatric = `OND/PROF/${randomNum}`;

      const user = await User.create({
        fullName: fullName || 'Student',
        email,
        password: hashedPassword, 
        registeredCourses: [], // <-- Set this to an empty array!
        hasPaidFees: false,
        role: 'Student', // Match the exact casing from your Mongoose enum
        matricNumber: generatedMatric 
      });

      return {
        token: generateToken(user.id),
        user
      };
    },

    // updateFeeStatus: async (_parent: any, { userId, status }: any) => {
    //   const updatedUser = await User.findByIdAndUpdate(
    //     userId,
    //     { hasPaidFees: status },
    //     { new: true }
    //   );

    //   if (!updatedUser) {
    //     throw new Error('User not found');
    //   }

    //   return updatedUser;
    // },
    registerCourses: async (_parent: any, { courseIds }: any, context: any) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    const updatedUser = await User.findByIdAndUpdate(
      context.user.id,
      { $set: { registeredCourses: courseIds } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  },
  },
};