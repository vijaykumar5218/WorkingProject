import {TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs';

import {Publisher} from '../publisher';
import {EventManagerService} from './event-manager.service';

describe('EventManagerService', () => {
  let service: EventManagerService;
  const event1Key = 'eventOne';
  const event2Key = 'eventTwo';
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(EventManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createSubscriber', () => {
    let eventObj;
    beforeEach(() => {
      eventObj = {
        test: true,
      };
    });

    it('should return an observable', () => {
      expect(service.createSubscriber(event1Key) instanceof Observable).toBe(
        true
      );
    });

    it('should emit event from publisher', done => {
      const pub = service.createPublisher(event1Key);
      service.createSubscriber(event1Key).subscribe(event => {
        expect(event).toEqual(eventObj);
        done();
      });
      pub.publish(eventObj);
    });

    it('should emit event of provided key', done => {
      const pub = service.createPublisher(event1Key);
      service.createSubscriber(event1Key).subscribe(event => {
        expect(event).toEqual(eventObj);
        done();
      });
      pub.publish(eventObj);
    });

    it('should not emit event from unprovided key', done => {
      const eventObj2 = {
        test: false,
      };

      const pub = service.createPublisher(event1Key);
      const pub2 = service.createPublisher(event2Key);
      service.createSubscriber(event1Key).subscribe(event => {
        expect(event).toEqual(eventObj);
        done();
      });
      pub2.publish(eventObj2);
      pub.publish(eventObj);
    });

    it('should emit last event on subscribe', done => {
      const pub = service.createPublisher(event1Key);
      pub.publish(eventObj);
      service.createSubscriber(event1Key).subscribe(event => {
        expect(event).toEqual(eventObj);
        done();
      });
    });
  });

  describe('createPublisher', () => {
    it('should return a publisher', () => {
      expect(service.createPublisher(event1Key) instanceof Publisher).toBe(
        true
      );
    });
  });
});
