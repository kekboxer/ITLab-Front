import moment from 'moment-timezone';
import { SystemPrivelegeName } from '@/state/priveleges';
import { setAxiosAuthHeader } from '@/stuff';

const LOCAL_STORAGE_PROFILE_ID = 'user-id';
const LOCAL_STORAGE_ACCESS_TOKEN = 'access-token';
const LOCAL_STORAGE_REFRESH_TOKEN = 'refresh-token';
const LOCAL_STORAGE_PRIVELEGES = 'privelges';

const LOCAL_STORAGE_SETTINGS_THEME = 'theme';

interface IAccessToken {
  nbf: number;
  exp: number;
}

class AccessToken {
  public readonly creationDate: Date;
  public readonly expirationDate: Date;

  constructor(decoded: IAccessToken) {
    this.creationDate = moment(decoded.nbf * 1000).toDate();
    this.expirationDate = moment(decoded.exp * 1000).toDate();
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

const decodeJWT = (token: string = ''): AccessToken | null => {
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

export class ProfileState {
  public id: string | null = null;

  public get isAuthorized(): boolean {
    return (
      this._accessToken != null &&
      this._accessToken.expirationDate.getTime() > Date.now()
    );
  }

  private _accessToken: AccessToken | null = null;
  private _refreshToken: string | null = null;
  private _priveleges: SystemPrivelegeName[] = [];

  constructor() {
    this.restore();
  }

  private restore() {
    const id = localStorage.getItem(LOCAL_STORAGE_PROFILE_ID);
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN);
    const priveleges = localStorage.getItem(LOCAL_STORAGE_PRIVELEGES);

    this.id = id;
    this._accessToken = accessToken ? decodeJWT(accessToken) : null;
    this._refreshToken = refreshToken;
    this._priveleges = priveleges
      ? (JSON.parse(atob(priveleges)) as SystemPrivelegeName[])
      : [];

    setAxiosAuthHeader(accessToken || undefined);
  }
}
