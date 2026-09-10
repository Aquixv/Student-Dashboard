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
  registeredCourses: [Course!]
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
  }
type AuthPayload {
  token: String!
  user: User!
}
  type Query {
    # Fetch the current user to determine if they hit the lockout screen
    me: User
    getBills: [Bill!]!
    # Fetch available courses for registration
    availableCourses: [Course!]!
    getStudents: [User!]!
  }

  type Mutation {
  registerUser(fullName: String!, email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  updateFeeStatus(userId: ID!, status: Boolean!, reference: String!): User!
  registerCourses(courseIds: [ID!]!): User!
  addCourse(code: String!, title: String!, units: Int!, type: String!): Course!
  addBill(description: String!, amount: Float!): Bill!
  deleteBill(id: ID!): ID!
  updateDepartment(userId: ID!, department: String!): User!
  uploadResult(matricNumber: String!, courseCode: String!, score: Int!): Result!
}
`;