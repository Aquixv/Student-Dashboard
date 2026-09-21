import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
  id: ID!
  fullName: String!
  email: String!
  matricNumber: String
  department: String
  level: String
  hasPaidFees: Boolean!
  role: String! 
  avatar: String
  program: String
  paymentProofUrl: String
  paymentStatus: String
  registeredCourses: [Course!]
}
  type Tutor {
  department: String!
  name: String!
}

type Settings {
  id: ID!
  activeSemester: String
  tutors: [Tutor]
}

  type Result {
  id: ID!
  matricNumber: String!
  courseCode: String!
  score: Int!
  grade: String!
}
  type Bill {
  id: ID!
  description: String!
  amount: Float!
}
type Transaction {
  id: ID!
  reference: String!
  amount: Float!
  description: String!
  createdAt: String!
}

  type Course {
    id: ID!
    code: String!
    title: String!
    units: Int!
    type: String!
    department: String!
  program: String!
  }
type AuthPayload {
  token: String!
  user: User!
}

input CourseInput {
  code: String!
  title: String!
  units: Int!
  type: String!
  department: String!
  program: String!
}

  type Query {
    # Fetch the current user to determine if they hit the lockout screen
    me: User
    getBills: [Bill!]!
    # Fetch available courses for registration
    availableCourses: [Course!]!
    getStudents: [User!]!
    getPendingPayments: [User]
    # Moved these to their rightful home!
    getStudentByMatric(matricNumber: String!): User
    getMyResults: [Result!]!
    searchStudents(searchTerm: String!): [User]
    getSystemSettings: Settings
  }

  type Mutation {
    registerUser(fullName: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateFeeStatus(userId: ID!, status: Boolean!, reference: String!): User!
    registerCourses(courseIds: [ID!]!): User!
    addCourse(code: String!, title: String!, units: Int!, type: String!, department: String!, program: String! ): Course!
    addBill(description: String!, amount: Float!): Bill!
    deleteBill(id: ID!): ID!
    updateDepartment(userId: ID!, department: String!): User!
    uploadResult(matricNumber: String!, courseCode: String!, score: Int!): Result!
    updateAvatar(avatarUrl: String!): User!
    updateProgram(userId: ID!, program: String!): User
    submitPaymentProof(userId: ID!, proofUrl: String!): User
  approvePayment(userId: ID!): User
  updateSemester(semester: String!): Settings
  updateTutor(department: String!, name: String!): Settings
  }`;