import { SystemPrivelege } from './types';
import {
  SystemPrivelegesRequest,
  AssignSystemPrivelegeRequest,
  DischargeSystemPrivelegeRequest
} from './requests';

import { User } from '@/state/users';

export * from './types';
export * from './requests';

export class SystemPrivelegesState {
  public get priveleges(): SystemPrivelege[] {
    return this._priveleges;
  }

  private _priveleges: SystemPrivelege[] = [];

  public async fetch() {
    this._priveleges = await new SystemPrivelegesRequest().execute();
    return this.priveleges;
  }

  public async fetchUserPriveleges(userId: string) {
    return await new SystemPrivelegesRequest(userId).execute();
  }

  public async assignPrivelege(user: User, privelege: SystemPrivelege) {
    return await new AssignSystemPrivelegeRequest(user, privelege).execute();
  }

  public async dischargePrivelege(user: User, privelege: SystemPrivelege) {
    return await new DischargeSystemPrivelegeRequest(user, privelege).execute();
  }
}
