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
export const GET_STUDENTS = gql`
  query GetStudents {
    getStudents {
      id
      fullName
      matricNumber
      department
      hasPaidFees
    }
  }
`;
export const GET_BILLS = gql`
  query GetBills {
    getBills { id description amount }
  }
`;
export const GET_MY_RESULTS = gql`
  query GetMyResults {
    getMyResults {
      id
      courseCode
      score
      grade
    }
  }
`;
export const GET_STUDENT_BY_MATRIC = gql`
  query GetStudentByMatric($matricNumber: String!) {
    getStudentByMatric(matricNumber: $matricNumber) {
      id
      fullName
      matricNumber
      department
      registeredCourses {
        id
        code
        title
      }
    }
  }
`;