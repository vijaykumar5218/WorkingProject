export interface ResourcesContent {
  resources: Resource[];
}

export interface Resource {
  type: string;
  header: string;
  links: ResourceLink[];
  isExpanded?: boolean;
}

export interface ResourceLink {
  text: string;
  link?: string;
  playerId?: string;
  videoUrl?: string;
}
