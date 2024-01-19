import {Injectable} from '@angular/core';
import {ReplaySubject, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

import {Publisher} from '../publisher';

@Injectable({
  providedIn: 'root',
})
export class EventManagerService {
  eventSubject: ReplaySubject<any>;

  constructor() {
    this.eventSubject = new ReplaySubject(1);
  }

  createSubscriber(eventKey: string): Observable<any> {
    return this.eventSubject.pipe(
      filter(event => event.key === eventKey),
      map(event => event.payload)
    );
  }

  createPublisher(eventKey: string): Publisher {
    return new Publisher(eventKey, this.eventSubject);
  }
}
