import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      fullName
      email
      matricNumber
      level
      department
      hasPaidFees
    }
  }
`;

export const GET_AVAILABLE_COURSES = gql`
  query GetAvailableCourses {
    availableCourses {
      id
      code
      title
      units
      type
    }
  }
`;