import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICourse extends Document {
  code: string;
  title: string;
  units: number;
  type: 'Compulsory' | 'Elective';
  schedule: {
    day: string;
    time: string;
    venue: string;
    instructor: string;
  };
}

const courseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    units: { type: Number, required: true },
    type: { type: String, enum: ['Compulsory', 'Elective'], required: true },
    schedule: {
      day: { type: String },
      time: { type: String },
      venue: { type: String },
      instructor: { type: String },
    }
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course;