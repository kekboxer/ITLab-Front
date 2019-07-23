import Oidc from 'oidc-client';

class UserManager {
  constructor(private oidcManager: Oidc.UserManager) {
  }

  public async getUserId(): Promise<string | null> {
    var user = await oidcManager.getUser();
    if (!user)
      return null;
    return user.profile.sub;
  }

  public signin(): Promise<any> {
    return oidcManager.signinRedirect();
  }

  public signout(): Promise<any> {
    return oidcManager.signoutRedirect();
  }

  public async signedin(): Promise<boolean> {
    var user = await oidcManager.getUser();
    return user != null;
  }

  public async accessToken(): Promise<string | null> {
    var user = await oidcManager.getUser();
    if (!user)
      return null;
    return user.access_token;
  }

  public get isAuthorized(): boolean {
    return true;
  }
}

const oidcManager = new Oidc.UserManager({
  authority: process.env.VUE_APP_AUTHORITY,
  client_id: process.env.VUE_APP_CLIENT_ID,
  redirect_uri: process.env.VUE_APP_REDIRECT_URI,
  response_type: process.env.VUE_APP_RESPONSE_TYPE,
  scope: process.env.VUE_APP_SCOPE,
  post_logout_redirect_uri: process.env.VUE_APP_POST_LOGOUT_REDIRECT_URI
});
const userManager = new UserManager(oidcManager);
export default userManager;