
export interface User {
  firstName: string
  lastName: string
  email: string
}

export interface RegistrationData extends User {
  studentId?: string
  userType: number
  password: string
}

export interface ProfileState {
  profile: User
}