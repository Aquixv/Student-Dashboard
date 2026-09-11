
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
  mutation UpdateFeeStatus($userId: ID!, $status: Boolean!, $reference: String!) {
    updateFeeStatus(userId: $userId, status: $status, reference: $reference) {
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
export const ADD_COURSE = gql`
  mutation AddCourse($code: String!, $title: String!, $units: Int!, $type: String!) {
    addCourse(code: $code, title: $title, units: $units, type: $type) {
      id
      code
      title
      units
      type
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        fullName
        role # <--- THIS IS THE MISSING PIECE
      }
    }
  }
`;
export const ADD_BILL = gql`
  mutation AddBill($description: String!, $amount: Float!) {
    addBill(description: $description, amount: $amount) { id description amount }
  }
`;

export const DELETE_BILL = gql`
  mutation DeleteBill($id: ID!) {
    deleteBill(id: $id)
  }
`;
export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($userId: ID!, $department: String!) {
    updateDepartment(userId: $userId, department: $department) {
      id
      department
    }
  }
`;
export const UPLOAD_RESULT = gql`
  mutation UploadResult($matricNumber: String!, $courseCode: String!, $score: Int!) {
    uploadResult(matricNumber: $matricNumber, courseCode: $courseCode, score: $score) {
      id
      courseCode
      score
      grade
    }
  }
`;
export const UPDATE_AVATAR = gql`
  mutation UpdateAvatar($avatarUrl: String!) {
    updateAvatar(avatarUrl: $avatarUrl) {
      id
      avatar
    }
  }
`;