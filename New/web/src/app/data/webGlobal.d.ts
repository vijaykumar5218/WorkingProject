import {Environment} from '../../../../shared-lib/models/environment.model';

export {};
declare global {
  interface Window {
    WebQualtrics?: any;
    environment: Environment;
    themeComponents?: any;
  }
}
