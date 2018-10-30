import axios from 'axios';
import { Response } from '@/stuff';

import { ISystemPrivelegeData, SystemPrivelege } from './types';
import { User } from '../users';

// SystemPrivelegesRequest //
////////////////////////////

interface ISystemPrivelegesResponseData {
  roles: ISystemPrivelegeData[];
}

export class SystemPrivelegesRequest {
  private _userId: string | null;
  private _url: string;

  public get isGeneral(): boolean {
    return this._userId == null;
  }

  public get isUserSpecific(): boolean {
    return !this.isGeneral;
  }

  constructor(userId?: string) {
    this._userId = userId || null;
    this._url = `roles/${this._userId || ''}`;
  }

  public async execute() {
    const result = new Response<ISystemPrivelegesResponseData>(
      await axios.get(this._url)
    );

    return result.data.roles.map((data) => new SystemPrivelege(data));
  }
}

// AssignSystemPrivelegeRequest //
/////////////////////////////////

export class AssignSystemPrivelegeRequest {
  private _url: string;

  constructor(user: User, privelege: SystemPrivelege) {
    this._url = `roles/${user.id}/${privelege}`;
  }

  public async execute() {
    const result = new Response<{}>(await axios.post(this._url));
  }
}

// DischargeSystemPrivelegeRequest //
/////////////////////////////////

export class DischargeSystemPrivelegeRequest {
  private _url: string;

  constructor(user: User, privelege: SystemPrivelege) {
    this._url = `roles/${user.id}/${privelege}`;
  }

  public async execute() {
    const result = new Response<{}>(await axios.delete(this._url));
  }
}
