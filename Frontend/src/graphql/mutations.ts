
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
mutation AddCourse($code: String!, $title: String!, $units: Int!, $type: String!, $department: String!, $program: String!) {
  addCourse(code: $code, title: $title, units: $units, type: $type, department: $department, program: $program) {
      id
      code
      title
      units
      type
      department 
      program
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
export const UPDATE_PROGRAM = gql`
  mutation UpdateProgram($userId: ID!, $program: String!) {
    updateProgram(userId: $userId, program: $program) {
      id
      program
      matricNumber  # <-- Ask the backend to send the freshly generated number back
    }
  }
`;
   export const APPROVE_PENDING_PAYMENTS = gql
   `mutation ApprovePayment($userId: ID!) {
  approvePayment(userId: $userId) {
    id
    hasPaidFees
    paymentStatus
  }
}
`;

export const SUBMIT_PAYMENT_PROOF = gql`
mutation SubmitPaymentProof($userId: ID!, $proofUrl: String!) {
  submitPaymentProof(userId: $userId, proofUrl: $proofUrl) {
    id
    level
    matricNumber
    program
    fullName
    hasPaidFees
    email
    department
  }
}`