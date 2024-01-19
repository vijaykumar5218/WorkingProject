export class InitAttriCollCallData {
  'timestamp': number;
  'screenHeight': number;
  'screenWidth': number;
  'colorDepth': string;
  'deviceLanguage': string;
  'browserPlugins': string;
  'devicePlatform': string;
  'deviceFonts': string;
  'baseUserAgent': string;
}

export interface NavigationModel {
  paramId: string;
  url: string;
}
