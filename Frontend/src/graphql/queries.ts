import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      fullName
      email
      matricNumber
      department
      level
      hasPaidFees
      role
      registeredCourses {
        id
        code
        title
        units
      }
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