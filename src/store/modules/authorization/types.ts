
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

// State //
//////////

export interface AuthorizationState {
  token: string | undefined
}