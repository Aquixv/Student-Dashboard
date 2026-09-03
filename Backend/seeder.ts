import Course from "./models/Courses";

export const seedCourses = async () => {
  const count = await Course.countDocuments();
  if (count > 0) return;

  const dummyCourses = [
    { code: 'CSC 201', title: 'Computer Programming I', units: 3, type: 'Compulsory', schedule: { day: 'Monday', time: '08:00 AM - 10:00 AM', venue: 'Lecture Theater 1', instructor: 'Dr. Dan-star' } },
    { code: 'MTH 201', title: 'Mathematical Methods I', units: 3, type: 'Compulsory', schedule: { day: 'Wednesday', time: '11:00 AM - 01:00 PM', venue: 'Science Block B', instructor: 'Prof. Alamu' } },
    { code: 'PHY 205', title: 'General Physics III', units: 2, type: 'Elective', schedule: { day: 'Tuesday', time: '09:00 AM - 11:00 AM', venue: 'Physics Lab', instructor: 'Dr. Smith' } },
    { code: 'GST 201', title: 'Communication Skills', units: 2, type: 'Elective', schedule: { day: 'Thursday', time: '02:00 PM - 04:00 PM', venue: 'Main Auditorium', instructor: 'Mrs. Johnson' } }
  ];

  await Course.insertMany(dummyCourses);
  console.log('📚 Dummy courses seeded successfully');
};