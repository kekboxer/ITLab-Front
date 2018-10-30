import axios from 'axios';
import { Response } from '@/stuff/';

import { IUserData, User } from './types';

// AllUsersRequest //
////////////////////

type AllUsersResponseData = IUserData[];

export class AllUsersRequest {
  public async execute() {
    const response = new Response<AllUsersResponseData>(
      await axios.get('user', {
        params: {
          count: -1
        }
      })
    );

    return response.data.map((data) => new User(data));
  }
}

// OneUserRequest //
///////////////////

type OneUserRequestData = IUserData;

export class OneUserRequest {
  private _userId: string;
  private _url: string;

  constructor(userId: string) {
    this._userId = userId;
    this._url = `user/${userId}`;
  }

  public async execute() {
    const response = new Response<OneUserRequestData>(
      await axios.get(this._url)
    );

    return new User(response.data);
  }
}
