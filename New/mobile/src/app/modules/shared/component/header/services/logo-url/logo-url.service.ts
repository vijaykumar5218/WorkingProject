import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {Publisher} from '@shared-lib/modules/event-manager/publisher';

@Injectable({
  providedIn: 'root',
})
export class LogoUrlService {
  logoUrlSubject: BehaviorSubject<string>;
  logoUrlPublisher: Publisher;
  constructor(private eventManager: EventManagerService) {
    this.logoUrlSubject = new BehaviorSubject(
      '../../../../assets/icon/voyalogo.png'
    );
    this.eventManager
      .createSubscriber('logoUrl')
      .subscribe(this.logoUrlSubject);
    this.logoUrlPublisher = this.eventManager.createPublisher('logoUrl');
  }

  publish(logoUrl: string) {
    this.logoUrlPublisher.publish(logoUrl);
  }

  getSubject(): BehaviorSubject<string> {
    return this.logoUrlSubject;
  }
}
