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
      click:string;
      add:string;
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
  actionsheet:{
    fromPhotos: string;
    fromCamera: string;
    cancel: string;
  }
}
