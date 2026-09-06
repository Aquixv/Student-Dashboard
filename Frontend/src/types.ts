export interface User {
  id: string;
  fullName: string;
  email: string;
  matricNumber: string;
  level?: string;
  department?: string;
  hasPaidFees: boolean;
  registeredCourses?: Course[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  type: 'Compulsory' | 'Elective';
}

// --- GraphQL Mutation Response Types ---

export interface RegisterResponse {
  registerUser: {
    token: string;
    user: User;
  };
}

export interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}

export interface UpdateFeeStatusResponse {
  updateFeeStatus: User;
}

// --- GraphQL Query Response Types ---

export interface GetMeResponse {
  me: User;
}

export interface GetAvailableCoursesResponse {
  availableCourses: Course[];
}