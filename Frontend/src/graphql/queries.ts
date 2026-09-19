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
      avatar
      program
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
export const SEARCH_STUDENTS = gql`
  query SearchStudents($searchTerm: String!) {
    searchStudents(searchTerm: $searchTerm) {
      id
      fullName
      matricNumber
      department
      program
      registeredCourses {     # <-- ADD THIS BLOCK
        id
        code
        title
      }
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
   export const GET_PENDING_PAYMENTS = gql
   `query GetPendingPayments {
  getPendingPayments {
    id
    fullName
    matricNumber
    paymentProofUrl
  }
}
`;
