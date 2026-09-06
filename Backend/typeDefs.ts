import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type User {
  id: ID!
  fullName: String!
  email: String!
  matricNumber: String
  level: String
  department: String
  hasPaidFees: Boolean!
  registeredCourses: [Course!] 
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
    
    # Fetch available courses for registration
    availableCourses: [Course!]!
  }

  type Mutation {
  registerUser(fullName: String!, email: String!, password: String!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  updateFeeStatus(userId: ID!, status: Boolean!): User!
  registerCourses(courseIds: [ID!]!): User!
}
`;