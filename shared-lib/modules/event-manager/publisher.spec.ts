import {ReplaySubject} from 'rxjs';

import {Publisher} from './publisher';

describe('Publisher', () => {
  let pubSubject: ReplaySubject<any>;
  let subject: Publisher;
  const eventKey = 'key';
  beforeEach(() => {
    pubSubject = new ReplaySubject(1);
    subject = new Publisher(eventKey, pubSubject);
  });
  it('should create an instance', () => {
    expect(subject).toBeTruthy();
  });

  describe('publish', () => {
    let eventObj;
    beforeEach(() => {
      eventObj = {
        test: true,
      };
    });
    it('should push event to subject', done => {
      pubSubject.subscribe(event => {
        expect(event.payload).toEqual(eventObj);
        done();
      });
      subject.publish(eventObj);
    });

    it('should push event key to subject', done => {
      pubSubject.subscribe(event => {
        expect(event.key).toEqual(eventKey);
        done();
      });
      subject.publish(eventObj);
    });
  });
});
