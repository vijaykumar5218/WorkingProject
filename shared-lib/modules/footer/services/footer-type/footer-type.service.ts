import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Publisher} from '@shared-lib/modules/event-manager/publisher';
import {FooterInfo} from '../../models/footerInfo.model';

@Injectable({
  providedIn: 'root',
})
export class FooterTypeService {
  private footerInfoPublisher: Publisher;
  constructor(private eventManagerService: EventManagerService) {
    this.footerInfoPublisher = this.eventManagerService.createPublisher(
      'footerInfo'
    );
  }

  createSubscriber(): Observable<FooterInfo> {
    return this.eventManagerService.createSubscriber('footerInfo');
  }

  publish(footerInfo: FooterInfo) {
    this.footerInfoPublisher.publish(footerInfo);
  }
}
