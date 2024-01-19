import {Icon, IconLink} from './navigation.model';

export interface RetirementFooter {
  dataStatus: string;
  footerLinks: RetirementFooterData;
  showRetireeToolbox: boolean;
  showRetireeJourneyToolbox: boolean;
}

interface RetirementFooterData {
  disclaimerText: string;
  copyRightText: string;
  navItems: any[];
  iconLinks: IconLink[];
  icons: Icon[];
}
