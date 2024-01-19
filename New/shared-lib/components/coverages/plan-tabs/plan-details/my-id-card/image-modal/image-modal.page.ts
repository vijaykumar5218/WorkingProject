import {Component, Input} from '@angular/core';
import {ModalController} from '@ionic/angular';
import SwiperCore, {SwiperOptions, Zoom} from 'swiper';

SwiperCore.use([Zoom]);

@Component({
  selector: '',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModal {
  @Input() img: string;
  config: SwiperOptions = {
    zoom: {
      maxRatio: 7,
    },
  };

  constructor(private modalController: ModalController) {}

  close() {
    this.modalController.dismiss();
  }
}
