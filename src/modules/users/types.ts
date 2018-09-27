// actions
export const USER_INVITE = 'USER_INVITE';
export const USER_SEARCH = 'USER_SEARCH';
export const USERS_FETCH_ALL = 'USERS_FETCH_ALL';
export const USERS_FETCH_ONE = 'USERS_FETCH_ONE';
export const USER_ASSIGN_EQUIPMENT = 'PROFILE_ASSIGN_EQUIPMENT';
export const USER_REMOVE_EQUIPMENT = 'PROFILE_REMOVE_EQUIPMENT';

// setters
export const USERS_SET_ALL = 'USERS_SET_ALL';
export const USERS_SET_ONE = 'USERS_SET_ONE';

// getters
export const USERS_GET_ALL = 'USERS_GET_ALL';
export const USERS_GET_ONE = 'USERS_GET_ONE';

// User //
/////////

export class UserDefault {
  public id: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public phoneNumber: string = '';
}

export interface IUser extends UserDefault {}

// State //
//////////

export interface IUsersState {
  users: IUser[];
}
