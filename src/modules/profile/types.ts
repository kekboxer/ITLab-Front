import { AccessToken } from '@/stuff';

// local storage
export const LOCAL_STORAGE_PROFILE_ID = 'user-id';
export const LOCAL_STORAGE_ACCESS_TOKEN = 'access-token';
export const LOCAL_STORAGE_REFRESH_TOKEN = 'refresh-token';
export const LOCAL_STORAGE_SETTINGS_THEME = 'theme';

// actions
export const PROFILE_LOGIN = 'PROFILE_REQUEST';
export const PROFILE_LOGOUT = 'PROFILE_LOGOUT';
export const PROFILE_REFRESH_ACCESS = 'PROFILE_REFRESH_ACCESS';
export const PROFILE_CREATE = 'PROFILE_CREATE';
export const PROFILE_WISH = 'PROFILE_WISH';
export const PROFILE_COMMIT = 'PROFILE_COMMIT';
export const PROFILE_SESSIONS_FETCH = 'PROFILE_SESSIONS_FETCH';
export const PROFILE_SESSIONS_DELETE = 'PROFILE_SESSIONS_DELETE';

// setters
export const PROFILE_SET = 'PROFILE_SET';
export const PROFILE_ACCESS_TOKEN_SET = 'PROFILE_ACCESS_TOKEN_SET';
export const PROFILE_REFRESH_TOKEN_SET = 'PROFILE_REFRESH_TOKEN_SET';
export const PROFILE_SETTINGS_THEME_SET = 'PROFILE_SETTINGS_THEME_SET';

// getters
export const PROFILE_GET = 'PROFILE_GET';
export const PROFILE_AUTHORIZED = 'PROFILE_AUTHORIZED';
export const PROFILE_REFRESH_TOKEN = 'PROFILE_REFRESH_TOKEN';
export const PROFILE_SETTINGS_THEME_GET = 'PROFILE_SETTINGS_THEME_GET';
export const PROFILE_HAS_ROLE = 'PROFILE_HAS_ROLE';

// AuthorizationData //
//////////////////////

export class AuthorizationDataDefault {
  public username: string = '';
  public password: string = '';
}

export interface IAuthorizationData extends AuthorizationDataDefault {}

// RegistractionData //
//////////////////////

export class RegistrationDataDefault {
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public password: string = '';
  public accessToken: string = '';
}

export interface IRegistrationData extends RegistrationDataDefault {}

// UserSession //
////////////////

export interface IUserSession {
  id: string;
  userAgent: string;
  createTime: Date;
}

// Settings //
/////////////

export interface ISettings {
  theme: string;
}

// State //
//////////

export interface IProfileState {
  profileId?: string;
  accessToken?: AccessToken;
  refreshToken?: string;

  settings: ISettings;
}
