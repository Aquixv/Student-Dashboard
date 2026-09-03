import User from './models/User';
import Course from './models/Courses';

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      const user = await User.findOne().sort({ createdAt: -1 });
      
      if (!user) {
        throw new Error('No users found in the database');
      }
      
      return user;
    },

    availableCourses: async () => {
      return await Course.find();
    },
  },

  Mutation: {
    registerUser: async (_parent: any, { fullName, email, password }: any) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      const defaultCourses = await Course.aggregate([
        { $match: { type: 'Compulsory' } },
        { $sample: { size: 2 } }
      ]);
      const courseIds = defaultCourses.map(course => course._id);
      const user = await User.create({
        name: fullName,
        email,
        password,
        registeredCourses: courseIds,
        hasPaidFees: false
      });

      return user;
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
  },
};