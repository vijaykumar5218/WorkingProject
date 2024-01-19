import {SubHeaderTab} from '@shared-lib/models/tab-sub-header.model';

export interface AccountDetailsPageText {
  default_tabs?: Array<SubHeaderTab>;
  goToAccount?: string;
  goToMyHistory?: string;
  without_transactions_tabs?: Array<SubHeaderTab>;
  tabs?: Array<SubHeaderTab>;
}
