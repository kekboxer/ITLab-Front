import moment from 'moment-timezone';
import { UserRoleName } from '@/modules/users';

interface IAccessToken {
  nbf: number;
  exp: number;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': UserRoleName[];
}

export class AccessToken {
  public readonly creationDate: Date;
  public readonly expirationDate: Date;
  public readonly roles: UserRoleName[];

  constructor(decoded: IAccessToken) {
    this.creationDate = moment(decoded.nbf * 1000).toDate();
    this.expirationDate = moment(decoded.exp * 1000).toDate();

    const roles =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    this.roles = roles ? (typeof roles === 'string' ? [roles] : roles) : [];
  }
}

const urlBase64Decode = (str: string) => {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      // tslint:disable-next-line:no-string-throw
      throw 'Illegal base64url string!';
  }
  return decodeURIComponent(escape(atob(output)));
};

export const decodeJWT = (token: string = ''): AccessToken | null => {
  let parts: string[] = [];

  if (
    token === null ||
    token === '' ||
    (parts = token.split('.')).length !== 3
  ) {
    return null;
  }

  const decoded = urlBase64Decode(parts[1]);
  if (decoded) {
    return new AccessToken(JSON.parse(decoded) as IAccessToken);
  } else {
    return null;
  }
};
