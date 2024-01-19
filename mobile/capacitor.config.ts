import {CapacitorConfig} from '@capacitor/cli';

let config: CapacitorConfig;

const baseConfig: CapacitorConfig = {
  appId: 'com.voya.edt.myvoyage',
  appName: 'myVoyage',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

switch (process.env.NODE_ENV) {
  case 'prod':
    config = {
      ...baseConfig,
      cordova: {
        preferences: {
          InAppBrowserStatusBarStyle: 'lightcontent',
          'com.salesforce.marketingcloud.app_id':
            '0bd83bb8-acd5-4ad7-acf5-3dbf83ee96c0',
          'com.salesforce.marketingcloud.access_token':
            'WzGfTODeQKSjkjzjrMLM028c',
          'com.salesforce.marketingcloud.tenant_specific_endpoint':
            'https://mcpg212dzgxf1q2673290s18f58m.device.marketingcloudapis.com/',
          'com.salesforce.marketingcloud.delay_registration_until_contact_key_is_set':
            'true',
          'com.salesforce.marketingcloud.notification_small_icon': 'splash',
        },
      },
    };
    break;
  default:
    config = {
      ...baseConfig,
      cordova: {
        preferences: {
          InAppBrowserStatusBarStyle: 'lightcontent',
          'com.salesforce.marketingcloud.app_id':
            '9bd8e778-f77b-4d9e-a206-b64571336e6b',
          'com.salesforce.marketingcloud.access_token':
            'vUpsnrMV1Xn2en4GZTRMUkJf',
          'com.salesforce.marketingcloud.tenant_specific_endpoint':
            'https://mcpg212dzgxf1q2673290s18f58m.device.marketingcloudapis.com/',
          'com.salesforce.marketingcloud.delay_registration_until_contact_key_is_set':
            'true',
          'com.salesforce.marketingcloud.notification_small_icon': 'splash',
        },
      },
    };
    break;
}

export default config;
