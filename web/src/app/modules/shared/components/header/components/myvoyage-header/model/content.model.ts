interface Items {
  text: string;
  link?: string;
  path?: string;
  id?: string;
  dropdownItems?: Items[];
}

export interface Content {
  navbarItems: Items[];
  dropdownItems: Items[];
  headerNames: Items[];
}

export interface SmallDeviceContent {
  title?: string;
  isBackBtn?: boolean;
  previousPage?: string;
}
