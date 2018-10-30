// UserPropertyType //
/////////////////////

export interface IUserPropertyTypeData {
  id: string;
  name: string;
  description?: string;
}

export class UserPropertyType implements IUserPropertyTypeData {
  public id: string = '';
  public name: string = '';
  public description: string = '';

  constructor(data?: IUserPropertyTypeData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.name = data.name;
    this.description = data.description || '';
  }
}

// UserProperty //
/////////////////

export interface IUserPropertyData {
  value: string;
  status: string;
  type: UserPropertyType;
}

export class UserProperty implements IUserPropertyData {
  public value: string;
  public status: string;
  public type: UserPropertyType;

  constructor(data: IUserPropertyData) {
    this.value = data.value;
    this.status = data.status;
    this.type = data.type;
  }
}

// User //
/////////

export interface IUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export class User {
  public id: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public email: string = '';
  public phoneNumber: string = '';

  constructor(data?: IUserData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
  }
}
