import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrangeMoneySizeService {
  isSizeOne(): boolean {
    return window.innerWidth > 1100;
  }

  isSizeTwo(): boolean {
    return window.innerWidth > 920 && window.innerWidth <= 1100;
  }

  isSizeThree(): boolean {
    return window.innerWidth >= 800 && window.innerWidth <= 920;
  }

  isSizeFour(): boolean {
    return window.innerWidth < 800;
  }
}
