import { User } from '@/modules/users';

// actions
export const PROFILE_LOGIN = 'PROFILE_REQUEST';
export const PROFILE_LOGOUT = 'PROFILE_LOGOUT';
export const PROFILE_CREATE = 'PROFILE_CREATE';
export const PROFILE_WISH = 'PROFILE_WISH';

// setters
export const PROFILE_SET = 'PROFILE_SET';
export const PROFILE_AUTH_TOKEN_SET = 'PROFILE_AUTH_TOKEN_SET';
export const PROFILE_SETTINGS_THEME_SET = 'PROFILE_SETTINGS_THEME_SET';

// getters
export const PROFILE_AUTHORIZED = 'PROFILE_AUTHORIZED';
export const PROFILE_SETTINGS_THEME_GET = 'PROFILE_SETTINGS_THEME_GET';

// AuthorizationData //
//////////////////////

export interface AuthorizationData {
  username: string;
  password: string;
}

export class AuthorizationDataDefault implements AuthorizationData {
  public username: string = '';
  public password: string = '';
}

// RegistractionData //
//////////////////////

export interface RegistrationData
  extends Pick<User, Exclude<keyof User, 'id'>> {
  password: string;
  accessToken: string;
}

export class RegistrationDataDefault implements RegistrationData {
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public password: string = '';
  public accessToken: string = '';
}

// Settings //
/////////////

export interface Settings {
  theme: string;
}

// State //
//////////

export interface ProfileState {
  profile?: User;
  authToken?: string;

  settings: Settings;
}
