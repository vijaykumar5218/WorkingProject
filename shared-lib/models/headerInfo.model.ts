import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {ActionOptions} from './ActionOptions.model';

export class HeaderInfo {
  type?: HeaderType;
  actionOption?: ActionOptions;
  text?: string;
}
