import User from './models/User';
import Course from './models/Courses';
import  generateToken  from './config/GenerateToken';
import bcrypt from 'bcryptjs';

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return context.user;
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

    registerUser: async (_parent: any, { fullName, email, password }: any) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const defaultCourses = await Course.aggregate([
        { $match: { type: 'Compulsory' } },
        { $sample: { size: 2 } }
      ]);
      const courseIds = defaultCourses.map(course => course._id);

      const user = await User.create({
        fullName: fullName || User.name,
        email,
        password: hashedPassword, 
        registeredCourses: courseIds,
        hasPaidFees: false
      });

      return {
        token: generateToken(user.id),
        user
      };
    },
    updateFeeStatus: async (_parent: any, { userId, status }: any) => {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { hasPaidFees: status },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    },
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