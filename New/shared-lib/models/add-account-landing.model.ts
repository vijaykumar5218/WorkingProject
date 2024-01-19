import {OrangeMoneyHeader} from '@shared-lib/services/account/models/orange-money.model';

export interface AddAccountLandingContent {
  addAccount?: {
    title?: string;
    subtitle?: string;
    benefits?: {
      title: string;
      list: List[];
    };
    usefulInfo?: {
      title: string;
      list: List[];
    };
    button?: {
      text: string;
    };
    termsAndConditionsLink: string;
  };
}

export interface List {
  text: string;
}

export interface AccountContent extends OrangeMoneyHeader {
  HSA_Transaction_FilterSort_SelectionList?: string;
  WorkplaceAddAccountsModalJSON?: string;
}
