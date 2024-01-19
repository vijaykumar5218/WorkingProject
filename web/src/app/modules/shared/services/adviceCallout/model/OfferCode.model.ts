export interface OfferCode {
  clientId: string;
  title: string;
  offerCode: string;
  messageType: string;
  investmentLink: string;
  imageTargetUrl: string;
  targetUrl?: string;
  messages?: string;
  linkName?: string;
  urls?: {
    FE_IFRAME_MINI: string;
    FE_SSGA_YOURMONEY: string;
    FE_IFRAME: string;
  };
}
