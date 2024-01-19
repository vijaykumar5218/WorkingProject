import {Category} from '@shared-lib/services/help/models/help.model';
export interface MenuConfig {
  items: MenuConfigItems[];
}

export interface MenuConfigItems {
  id?: string;
  route: string;
  text: string;
  category?: Category;
  icon?: string;
  enableMyVoyage?: boolean;
}

export interface MenuOptions {
  TCUrl: string;
  termsId: string;
  feedbackId: string;
  manageAcctsId: string;
}
