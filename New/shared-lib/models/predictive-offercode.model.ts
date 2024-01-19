export interface OfferCodeType {
  messages: string[];
  link_name: string;
  link_url: string;
}
export interface RootObjectOfferCode {
  icon: string;
  headerName: string;
  MANACCT: OfferCodeType;
  MANACTIPS: OfferCodeType;
}
