export interface LandingAddAccountCarousels {
  heroCarousel: LandingAddAccountCarouselItems[];
}

export interface LandingAddAccountCarouselItems {
  id: string;
  sectionHeader: string;
  image: string;
  bodyTitle: string;
  bodyText: string;
  ctaLabel: string;
  url: string;
  score: number;
  type: string;
  status: string;
}
