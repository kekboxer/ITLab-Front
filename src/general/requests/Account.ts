
export interface IAccountLoginRequest {
  username?: string
  password?: string
  remember?: boolean
}

export interface IAccountCreateRequest {
  firstName?: string
  lastName?: string
  userType?: string
  email?: string
  password?: string
  studentId?: string
}