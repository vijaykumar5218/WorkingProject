export interface OfferCodeType {
  icon: string;
  messages: string[];
  link_name: string;
  link_url: string;
}
export interface RootCarouselOfferCode {
  INCCONT: OfferCodeType;
  CATCHUP: OfferCodeType;
  DIVERSE: OfferCodeType;
  DIVFE: OfferCodeType;
  DIVMA: OfferCodeType;
  RESAVING: OfferCodeType;
  ROLLIN: OfferCodeType;
  ROLLOVER: OfferCodeType;
}

export interface PredictiveMessage {
  OfferCodeJSON?: string;
  OfferCodeAdviceJSON?: string;
  workplaceAdviceTileJSON?: string;
  translationMessage?: string;
}
