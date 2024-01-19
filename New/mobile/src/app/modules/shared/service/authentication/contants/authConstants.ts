import {IonicAuthOptions} from '@ionic-enterprise/auth';
import {
  DeviceSecurityType,
  IdentityVaultConfig,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import {environment} from 'mobile/environments/environment';

export const authTimeouts = {
  faceIDTimout: 30 * 1000, //30 seconds
  nonFaceIDTimeout: 15 * 60 * 1000, //15 minutes
  faceIDRefreshTimout: 15 * 60 * 1000, //15 mins
};

export const biometricsVaultConfig: IdentityVaultConfig = {
  key: 'com.voya.edt.myvoyage',
  type: VaultType.DeviceSecurity,
  deviceSecurityType: DeviceSecurityType.Biometrics,
  lockAfterBackgrounded: authTimeouts.faceIDTimout,
  unlockVaultOnLoad: false,
  shouldClearVaultAfterTooManyFailedAttempts: false,
};

export const defaultVaultConfig: IdentityVaultConfig = {
  key: 'com.voya.edt.myvoyage',
  type: VaultType.SecureStorage,
  deviceSecurityType: DeviceSecurityType.None,
  lockAfterBackgrounded: null,
  unlockVaultOnLoad: false,
  shouldClearVaultAfterTooManyFailedAttempts: false,
};

export const auth0NativeConfig: IonicAuthOptions = {
  // the auth provider
  authConfig: 'general',
  // The platform which the app is running on
  platform: 'capacitor',
  // client or application id for provider
  clientID: environment.authClientID,
  // the discovery url for the provider
  // OpenID configuration
  discoveryUrl: environment.tokenBaseUrl + environment.openIdConfigurationUrl,
  // the URI to redirect to after log in
  redirectUri: 'com.voya.edt.myvoyage://oidc_callback',
  // requested scopes from provider
  scope:
    'login_id global_id given_name family_name phone_number csr_user vid rs_domain email openid myvoya',
  // the URL to redirect to after log out
  logoutUrl: 'landing',
  // The type of iOS webview to use. 'shared' will use a webview that can
  // share session/cookies on iOS to provide SSO across multiple apps but
  // will cause a prompt for the user which asks them to confirm they want
  // to share site data with the app. 'private' uses a webview which will
  // not prompt the user but will not be able to share session/cookie data
  // either for true SSO across multiple apps.
  iosWebView: 'private',
  logLevel: 'DEBUG',
  webAuthFlow: 'PKCE',
  implicitLogin: 'CURRENT',
};
