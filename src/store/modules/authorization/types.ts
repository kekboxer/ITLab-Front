
export interface AuthorizationData {
  username: string
  password: string
}

export enum AuthorizationStatus {
  Loading,
  Success,
  Error
}

export const authorizationStatusLabels: Map<AuthorizationStatus, string> = new Map([
  [ AuthorizationStatus.Loading, "Выполняется вход..." ],
  [ AuthorizationStatus.Success, "Успешная авторизация" ],
  [ AuthorizationStatus.Error, "Ошибка авторизации" ]
])

export interface AuthorizationState {
  token?: string
  status?: AuthorizationStatus
}