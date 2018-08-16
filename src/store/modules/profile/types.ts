import { User } from "@/store/modules/users"

// actions
export const PROFILE_LOGIN = "PROFILE_REQUEST"
export const PROFILE_LOGOUT = "PROFILE_LOGOUT"
export const PROFILE_CREATE = "PROFILE_CREATE"

// setters
export const PROFILE_SET = "PROFILE_SET"
export const PROFILE_AUTH_TOKEN_SET = "PROFILE_AUTH_TOKEN_SET"
export const PROFILE_SETTINGS_THEME_SET = "PROFILE_SETTINGS_THEME_SET"

// getters
export const PROFILE_AUTHORIZED = "PROFILE_AUTHORIZED"
export const PROFILE_SETTINGS_THEME_GET = "PROFILE_SETTINGS_THEME_GET"


// AuthorizationData //
//////////////////////

export interface AuthorizationData {
  username: string
  password: string
}

export class AuthorizationDataDefault implements AuthorizationData {
  username: string = ""
  password: string = ""
}

// RegistractionData //
//////////////////////

export interface RegistrationData extends Pick<User, Exclude<keyof User, "id">> {
  studentId?: string
  password: string
}

export class RegistrationDataDefault implements RegistrationData {
  firstName: string = ""
  lastName: string = ""
  email: string = ""
  password: string = ""
}

// Settings //
/////////////

export interface Settings {
  theme: string
}

// State //
//////////

export interface ProfileState {
  profile?: User
  authToken?: string

  settings: Settings
}
