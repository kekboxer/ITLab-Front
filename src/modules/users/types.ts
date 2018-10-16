// actions
export const USER_INVITE = 'USER_INVITE';
export const USER_SEARCH = 'USER_SEARCH';
export const USERS_FETCH_ALL = 'USERS_FETCH_ALL';
export const USERS_FETCH_ONE = 'USERS_FETCH_ONE';
export const USER_ASSIGN_EQUIPMENT = 'PROFILE_ASSIGN_EQUIPMENT';
export const USER_REMOVE_EQUIPMENT = 'PROFILE_REMOVE_EQUIPMENT';
export const USER_ROLES_FETCH = 'USER_ROLES_FETCH';
export const USER_ROLE_ASSIGN = 'USER_ROLE_ASSIGN';
export const USER_ROLE_DISCHARGE = 'USER_ROLE_DISCHARGE';

// setters
export const USERS_SET_ALL = 'USERS_SET_ALL';
export const USERS_SET_ONE = 'USERS_SET_ONE';
export const USER_ROLES_SET_ALL = 'USER_ROLES_SET_ALL';

// getters
export const USERS_GET_ALL = 'USERS_GET_ALL';
export const USERS_GET_ONE = 'USERS_GET_ONE';
export const USER_ROLES_GET_ALL = 'USER_ROLES_GET_ALL';

// UserRoles //
//////////////

export type UserRoleName =
  | ''
  | 'CanEditEquipment'
  | 'CanEditEquipmentOwner'
  | 'CanEditEquipmentType'
  | 'CanEditRoles'
  | 'CanEditEvent'
  | 'CanEditEventType'
  | 'CanInviteToSystem'
  | 'CanDeleteEventRole';

export class UserRoleDefault {
  public id: string = '';
  public name: UserRoleName = '';
}

export interface IUserRole extends UserRoleDefault {}

// UserPropertyType //
/////////////////////

export class UserPropertyTypeDefault {
  public id: string = '';
  public name: string = '';
  public description: string = '';
}

export interface IUserPropertyType extends UserPropertyTypeDefault {}

// UserProperty //
/////////////////

export class UserPropertyDefault {
  public value: string = '';
  public status: string = '';
  public userPropertyType: IUserPropertyType = new UserPropertyTypeDefault();
}

export interface IUserProperty extends UserPropertyDefault {}

// User //
/////////

export class UserDefault {
  public id: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public phoneNumber: string = '';
  public properties?: IUserProperty[];
}

export interface IUser extends UserDefault {}

// State //
//////////

export interface IUsersState {
  users: IUser[];
  userRoles: IUserRole[];
}
