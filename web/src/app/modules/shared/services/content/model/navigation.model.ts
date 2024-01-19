export interface IconLink {
  iconName: string;
  linkURL: string;
  linkLabel: string;
  id?: string;
  target?: string;
  languages?: Language[];
}

interface Language {
  label: string;
  value: string;
}
export interface Icon {
  iconname: string;
  href: string;
  iconsize?: string;
  id?: string;
}

interface Items {
  label?: string;
  link?: string;
  id?: string;
  newMessageCount?: number;
  dropdownItems?: Items[];
  target?: string;
}

export interface HeaderConfig {
  navbarItems?: Items[];
  dropdownItems?: Items[];
}

export interface HeaderContent {
  workplaceHeader?: HeaderConfig;
  workplaceHamburger?: MobileNavigation;
}

export interface HeaderJSONContent {
  workplaceHeader?: string;
  workplaceHamburger?: string;
}

interface MenuItem {
  label?: string;
  link?: string;
  id?: string;
  to?: string;
  target?: string;
  newMessageCount?: number;
}

interface FooterItem {
  label: string;
  link: string;
  id: string;
  iconName: string;
}
interface MenuPage {
  id: string;
  title?: string;
  level: number;
  items: MenuItem[];
  from?: string;
  breadcrumbText?: string;
}

export interface MobileNavigation {
  menuPages: MenuPage[];
  navigationFooterItems: FooterItem[];
}
