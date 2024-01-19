export interface PageContent {
  cardSection: {
    header: {
      upload: string;
      frontSide: string;
      backSide: string;
    };
    subHeader: string;
    browse: {
      browse: string;
      choose: string;
    };
  };
  card: {
    header: {
      frontSide: string;
      backSide: string;
      change: string;
    };
  };
  common: {
    card: string;
  };
}
