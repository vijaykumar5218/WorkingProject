import {Component, OnInit} from '@angular/core';
import {RootCarouselOfferCode} from '@shared-lib/models/carousel-offercode.model';
import {OfferCode} from '@shared-lib/models/offercode.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import * as PageText from './constants/carousel-text.json';
import {SwiperOptions} from 'swiper';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.page.html',
  styleUrls: ['./carousel.page.scss'],
})
export class CarouselPage implements OnInit {
  pageText = (PageText as any).default;
  textPredval: RootCarouselOfferCode;
  offerVal: OfferCode[];
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 1,
    navigation: true,
    pagination: {clickable: true},
    scrollbar: {draggable: true},
  };
  constructor(private accountService: AccountService) {}

  async ngOnInit() {
    this.getpredictValue();
    this.getOfferCodeValue();
  }

  async getOfferCodeValue() {
    this.accountService.getOffercode().then((res: OfferCode[]) => {
      this.offerVal = res?.filter(
        offercode =>
          offercode.offerCode === 'DIVMA' ||
          offercode.offerCode === 'CATCHUP' ||
          offercode.offerCode === 'INCCONT' ||
          offercode.offerCode === 'DIVERSE' ||
          offercode.offerCode === 'DIVFE' ||
          offercode.offerCode === 'RESAVING' ||
          offercode.offerCode === 'ROLLIN' ||
          offercode.offerCode === 'ROLLOVER'
      );
      if (this.offerVal?.length > 1) {
        this.config = {
          slidesPerView: 1.2,
          spaceBetween: 1,
          navigation: true,
          pagination: {clickable: true},
          scrollbar: {draggable: true},
        };
      }
    });
  }

  async getpredictValue() {
    this.accountService
      .getCarouselData()
      .then((data: RootCarouselOfferCode) => {
        this.textPredval = data;
      });
  }
}
