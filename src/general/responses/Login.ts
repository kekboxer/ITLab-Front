import { IResponse } from "./Response"

export interface ILoginResponse extends IResponse {
  id: string
  token: string
  firstName: string
  lastName: string
  studentId: string
}