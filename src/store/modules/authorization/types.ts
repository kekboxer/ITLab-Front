
export interface AuthorizationData {
  username: string
  password: string
}

export const createDefaultAuthorizationData = (): AuthorizationData => {
  return {
    username: "",
    password: ""
  }
}

export interface AuthorizationState {
  token: string | undefined
}