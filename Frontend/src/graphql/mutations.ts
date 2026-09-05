
import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation RegisterUser($fullName: String!, $email: String!, $password: String!) {
    registerUser(fullName: $fullName, email: $email, password: $password) {
      token
      user {
        id
        fullName
        email
        matricNumber
        hasPaidFees
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        fullName
        email
        matricNumber
        hasPaidFees
      }
    }
  }
`;

export const UPDATE_FEE_STATUS = gql`
  mutation UpdateFeeStatus($userId: ID!, $status: Boolean!) {
    updateFeeStatus(userId: $userId, status: $status) {
      id
      hasPaidFees
    }
  }
`;
export const REGISTER_COURSES = gql`
  mutation RegisterCourses($courseIds: [ID!]!) {
    registerCourses(courseIds: $courseIds) {
      id
      hasPaidFees
      # We fetch this so the Apollo Cache automatically updates the user's unit count elsewhere
    }
  }
`;