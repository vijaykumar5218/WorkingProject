import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Publisher} from '@shared-lib/modules/event-manager/publisher';
import {HeaderInfo} from '@shared-lib/models/headerInfo.model';

@Injectable({
  providedIn: 'root',
})
export class HeaderTypeService {
  private headerInfoPublisher: Publisher;

  constructor(private eventManagerService: EventManagerService) {
    this.headerInfoPublisher = this.eventManagerService.createPublisher(
      'headerInfo'
    );
  }

  createSubscriber(): Observable<HeaderInfo> {
    return this.eventManagerService.createSubscriber('headerInfo');
  }

  publish(headerInfo: HeaderInfo) {
    this.headerInfoPublisher.publish(headerInfo);
  }
}
