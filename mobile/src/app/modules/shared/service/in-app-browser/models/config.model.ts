import {IABHeaderType} from '../constants/headerType.enum';

export class IABConfig {
  url: string;
  headerType: IABHeaderType;
  setCookies?: boolean;
  headerName?: string;
  btnName?: string;
  redirectUrl?: string;
  closeRoute?: string;
}
