import {ConsentType} from '../constants/consentType.enum';

export interface ConsentStatus {
  consentTypeName: ConsentType;
  consentStatus: string;
}
