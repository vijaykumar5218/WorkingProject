export interface MoreResourcesLinks {
  resourceLink: ResourcesLinks;
  dataStatus: string;
}

export interface ResourcesLinks {
  label?: string;
  id?: string;
  subLinks?: ResourcesSubLinks[];
}

interface ResourcesSubLinks {
  label?: string;
  link?: string;
  icon?: string;
  order?: number;
  popup?: boolean;
}
