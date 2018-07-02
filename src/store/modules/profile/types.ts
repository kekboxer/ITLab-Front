
// User //
/////////

export interface User {
  firstName: string
  lastName: string
  email: string
}

// RegistractionData //
//////////////////////

export interface RegistrationData extends User {
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