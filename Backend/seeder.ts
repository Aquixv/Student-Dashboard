import Course from "./models/Courses";

export const seedCourses = async () => {
  // Temporarily comment this out to force the new courses in:
  // const count = await Course.countDocuments();
  // if (count > 0) return; 

  const dummyCourses = [
    { code: 'CSC 201', title: 'Computer Programming I', units: 3, type: 'Compulsory', schedule: { day: 'Monday', time: '08:00 AM - 10:00 AM', venue: 'Lecture Theater 1', instructor: 'Dr. Dan-star' } },
    { code: 'MTH 201', title: 'Mathematical Methods I', units: 3, type: 'Compulsory', schedule: { day: 'Wednesday', time: '11:00 AM - 01:00 PM', venue: 'Science Block B', instructor: 'Prof. Alamu' } },
    { code: 'PHY 205', title: 'General Physics III', units: 2, type: 'Elective', schedule: { day: 'Tuesday', time: '09:00 AM - 11:00 AM', venue: 'Physics Lab', instructor: 'Dr. Smith' } },
    { code: 'GST 201', title: 'Communication Skills I', units: 2, type: 'Compulsory', schedule: { day: 'Thursday', time: '02:00 PM - 04:00 PM', venue: 'Main Auditorium', instructor: 'Mrs. Johnson' } },
    { code: 'CSC 203', title: 'Discrete Mathematics', units: 3, type: 'Compulsory', schedule: { day: 'Friday', time: '10:00 AM - 12:00 PM', venue: 'LT 2', instructor: 'Dr. Dan-star' } },
    { code: 'CSC 205', title: 'Operating Systems I', units: 3, type: 'Compulsory', schedule: { day: 'Monday', time: '01:00 PM - 03:00 PM', venue: 'Computer Lab 1', instructor: 'Mr. Peters' } },
    { code: 'STA 201', title: 'Statistics for Physical Sciences', units: 3, type: 'Elective', schedule: { day: 'Wednesday', time: '08:00 AM - 10:00 AM', venue: 'Science Block A', instructor: 'Dr. Adams' } },
    { code: 'ENT 201', title: 'Entrepreneurship Studies', units: 2, type: 'Compulsory', schedule: { day: 'Friday', time: '02:00 PM - 04:00 PM', venue: 'Main Auditorium', instructor: 'Dr. Okafor' } },
    { code: 'CSC 207', title: 'Systems Analysis & Design', units: 3, type: 'Elective', schedule: { day: 'Tuesday', time: '01:00 PM - 03:00 PM', venue: 'LT 1', instructor: 'Prof. Adeyemi' } },
    { code: 'MTH 203', title: 'Linear Algebra', units: 2, type: 'Elective', schedule: { day: 'Thursday', time: '10:00 AM - 12:00 PM', venue: 'Science Block B', instructor: 'Prof. Alamu' } }
  ];

  // Use upsert/updateOne or simply clear the collection first to avoid duplicates on unique 'code'
  await Course.deleteMany({}); 
  await Course.insertMany(dummyCourses);
  console.log('📚 Expanded dummy courses seeded successfully');
};