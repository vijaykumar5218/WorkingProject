import {ReplaySubject} from 'rxjs';

export class Publisher {
  private eventKey: string;
  private eventSubject: ReplaySubject<any>;

  constructor(eventKey: string, eventSubject: ReplaySubject<any>) {
    this.eventKey = eventKey;
    this.eventSubject = eventSubject;
  }

  publish(event: any) {
    this.eventSubject.next({
      key: this.eventKey,
      payload: event,
    });
  }
}
