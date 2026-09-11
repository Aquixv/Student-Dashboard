import User from './models/User';
import Course from './models/Courses';
import  generateToken  from './config/GenerateToken';
import bcrypt from 'bcryptjs';
import Transactions from './models/Transactions';
import Bill from './bills';
import Result from './models/Results'

export const resolvers = {
  Query: {
   me: async (_parent: any, _args: any, context: any) => {
    if (!context.user) {
      throw new Error('Not authenticated');
    }
    const user = await User.findById(context.user.id).populate('registeredCourses');
    return user;
  },
  getStudents: async (_parent: any, _args: any, context: any) => {
  if (!context.user || context.user.role !== 'Admin') throw new Error('Unauthorized');
  return await User.find({ role: 'Student' }).sort({ createdAt: -1 });
},
getMyResults: async (_parent: any, _args: any, context: any) => {
  if (!context.user) throw new Error('Not authenticated');
  const user = await User.findById(context.user.id);
  if (!user || !user.matricNumber) return [];
  return await Result.find({ matricNumber: user.matricNumber });
},
getStudentByMatric: async (_parent: any, { matricNumber }: any, context: any) => {
  if (!context.user || context.user.role !== 'Admin') throw new Error('Unauthorized');
  // Populate the courses so we know exactly what they registered for!
  return await User.findOne({ matricNumber }).populate('registeredCourses');
},
    availableCourses: async () => await Course.find(),
getBills: async () => await Bill.find().sort({ createdAt: 1 }),
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
uploadResult: async (_parent: any, { matricNumber, courseCode, score }: any, context: any) => {
  if (!context.user || context.user.role !== 'Admin') throw new Error('Unauthorized');
  
  // Auto-calculate the grade based on standard university curves
  let grade = 'F';
  if (score >= 70) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 50) grade = 'C';
  else if (score >= 45) grade = 'D';

  return await Result.create({
    matricNumber,
    courseCode,
    score,
    grade
  });
},
addBill: async (_parent: any, { description, amount }: any, context: any) => {
  if (!context.user || context.user.role !== 'Admin') throw new Error('Unauthorized');
  return await Bill.create({ description, amount });
},
deleteBill: async (_parent: any, { id }: any, context: any) => {
  if (!context.user || context.user.role !== 'Admin') throw new Error('Unauthorized');
  await Bill.findByIdAndDelete(id);
  return id;
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
  updateDepartment: async (_parent: any, { userId, department }: any, context: any) => {
  if (!context.user || context.user.role !== 'Admin') throw new Error('Unauthorized');
  
  return await User.findByIdAndUpdate(
    userId,
    { $set: { department } },
    { new: true }
  );
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

addCourse: async (_parent: any, { code, title, units, type }: any, context: any) => {
  // Ensure the user actually has the Admin token
  if (!context.user || context.user.role !== 'Admin') {
    throw new Error('Unauthorized access');
  }

  const newCourse = await Course.create({
    code,
    title,
    units,
    type,
  });

  return newCourse;
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
  updateAvatar: async (_parent: any, { avatarUrl }: { avatarUrl: string }, context: any) => {
  if (!context.user) throw new Error('Not authenticated');
  return await User.findByIdAndUpdate(
    context.user.id,
    { avatar: avatarUrl },
    { new: true }
  );
},
  },
};