
export interface User {
  firstName: string
  lastName: string
  email: string
}

export interface RegistrationData extends User {
  studentId?: string
  password: string
}

export const createDefaultRegistrationData = (): RegistrationData => {
  return {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  }
}

export interface ProfileState {
  profile: User | undefined
}