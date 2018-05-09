
export interface User {
  firstName: string
  lastName: string
  email: string
}

export interface RegistrationData extends User {
  studentId?: string
  userType: string
  password: string
}

export interface ProfileState {
  profile: User | undefined
}