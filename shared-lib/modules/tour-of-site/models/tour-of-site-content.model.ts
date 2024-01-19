export interface TourOfSiteResponse {
  tourContent: TourOfSiteContent;
}

export interface TourOfSiteContent {
  desktop: TourOfSiteContentItem[];
  mobile: TourOfSiteContentItem[];
}

export interface TourOfSiteContentItem {
  id: string;
  selector: string;
  intro?: string;
  gaLabel?: string;
  selectorSource?: string;
  subContent?: TourOfSiteContentItem[];
  tooltipClass?: string;
  tooltipPosition?:
    | 'floating'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-right-aligned'
    | 'top-left-aligned'
    | 'top-middle-aligned'
    | 'bottom-right-aligned'
    | 'bottom-left-aligned'
    | 'bottom-middle-aligned';
    action?: ActionEvent;
}

export interface ActionEvent {
    event: string;
    selector: string;
}

export type TourContentType = 'desktop' | 'tablet' | 'mobile';