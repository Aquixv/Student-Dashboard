import User from './models/User';
import Course from './models/Courses';
import  generateToken  from './config/GenerateToken';
import bcrypt from 'bcryptjs';
import Transactions from './models/Transactions';
import Bill from './bills';
import Result from './models/Results'
const Settings = require('./models/Settings');

export const resolvers = {
  Query: {
   getSystemSettings: async () => {
      return await Settings.findOneAndUpdate(
        {}, 
        {}, 
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    },
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const user = await User.findById(context.user.id).populate('registeredCourses');
      return user;
    },
    searchStudents: async (_parent: any, { searchTerm }: any, context: any) => {
      return await User.find({
        matricNumber: { $regex: searchTerm, $options: 'i' },
        role: 'Student' 
      }).populate('registeredCourses'); // <-- THIS IS THE MAGIC WORD
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
getPendingPayments: async () => {
    // Fetches everyone who uploaded a receipt but hasn't been approved
    return await User.find({ paymentStatus: 'Pending' });
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

      // 1. Grab the current year to satisfy the new client requirement
      const currentYear = new Date().getFullYear();

      // 2. Generate a random 4-digit ID
      const randomNum = Math.floor(1000 + Math.random() * 9000);

      // 3. Create a Provisional Matric Number (e.g., PROV/2026/8342)
      const generatedMatric = `PROV/${currentYear}/${randomNum}`;

      const user = await User.create({
        fullName: fullName || 'Student',
        email,
        password: hashedPassword, 
        registeredCourses: [], 
        hasPaidFees: false,
        role: 'Student', 
        matricNumber: generatedMatric,
        // program: null // Explicitly null so the Admin knows to assign it
      });

      return {
        token: generateToken(user.id),
        user
      };
    },
approvePayment: async (_parent: any, { userId }: any) => {
  return await User.findByIdAndUpdate(
    userId, 
    { hasPaidFees: true, paymentStatus: 'Verified' }, 
    { new: true }
  );
},
addCourse: async (_parent: any, { code, title, units, type, department, program }: any, context: any) => {
  // Ensure the user actually has the Admin token
  if (!context.user || context.user.role !== 'Admin') {
    throw new Error('Unauthorized access');
  }

  const newCourse = await Course.create({
    code,
    title,
    units,
    type,
    department,
    program,
  });

  return newCourse;
},
updateProgram: async (_parent: any, { userId, program }: any, context: any) => {
      // 1. Fetch the user first
      const user = await User.findById(userId);
      if (!user) throw new Error('Student not found');

      // 2. Break down their current matric number (e.g., 'PROV/1234' or 'OND/2025/1234')
      const matricParts = user.matricNumber?.split('/');
      
      // Grab just the final digits from the array (always the last item)
      const sequenceNumber = matricParts?.[matricParts.length - 1];
      
      // Get the current year
      const currentYear = new Date().getFullYear();

      // 3. Determine the new prefix
      const prefix = program === 'Professional' ? 'PROF' : 'OND';

      // 4. Reconstruct the perfect string (e.g., 'PROF/2026/1234')
      const newMatricNumber = `${prefix}/${currentYear}/${sequenceNumber}`;

      // 5. Save the updated data
      user.program = program;
      user.matricNumber = newMatricNumber;
      await user.save();

      return user;
    },
    submitPaymentProof: async (_parent: any, { userId, proofUrl }: any, context: any) => {
  return await User.findByIdAndUpdate(
    userId, 
    { paymentProofUrl: proofUrl, paymentStatus: 'Pending' }, 
    { new: true }
  );
},
  updateAvatar: async (_parent: any, { avatarUrl }: { avatarUrl: string }, context: any) => {
  if (!context.user) throw new Error('Not authenticated');
  return await User.findByIdAndUpdate(
    context.user.id,
    { avatar: avatarUrl },
    { new: true }
  );
},
updateSemester: async (_parent: any, { semester }: any, context: any) => {
      return await Settings.findOneAndUpdate(
        {},
        { activeSemester: semester },
        { new: true, upsert: true }
      );
    },
    updateTutor: async (_parent: any, { department, name }:any, context: any) => {
      const settings = await Settings.findOneAndUpdate(
        {},
        {},
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      const existingTutorIndex = settings.tutors.findIndex((t: any) => t.department === department);
      if (existingTutorIndex > -1) {
        settings.tutors[existingTutorIndex].name = name;
      } else {
        settings.tutors.push({ department, name });
      }

      await settings.save();
      return settings;
    }
  },
};