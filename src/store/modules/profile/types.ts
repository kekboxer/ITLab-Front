
// User //
/////////

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}


export class UserDefault implements User {
  id: string = ""
  firstName: string = ""
  lastName: string = ""
  email: string = ""
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
  profile: User | undefined,
  settings: Settings
}