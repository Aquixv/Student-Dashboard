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
  }

  type Course {
    id: ID!
    code: String!
    title: String!
    units: Int!
    type: String!
  }

  type Query {
    # Fetch the current user to determine if they hit the lockout screen
    me: User
    
    # Fetch available courses for registration
    availableCourses: [Course!]!
  }

  type Mutation {
    # We will wire this up to Firebase Auth or a custom JWT later
    registerUser(fullName: String!, email: String!, uid: String!): User!
    
    # Triggered when the payment gateway sends a success webhook
    updateFeeStatus(userId: ID!, status: Boolean!): User!
  }
`;