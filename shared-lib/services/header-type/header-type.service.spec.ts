import {TestBed, waitForAsync} from '@angular/core/testing';
import {HeaderTypeService} from './header-type.service';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {of} from 'rxjs';
import {HeaderType} from '../../constants/headerType.enum';

describe('HeaderTypeService', () => {
  let service: HeaderTypeService;
  let eventManagerServiceSpy;

  beforeEach(
    waitForAsync(() => {
      eventManagerServiceSpy = jasmine.createSpyObj('EventManagerService', [
        'createPublisher',
        'createSubscriber',
      ]);
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          {provide: EventManagerService, useValue: eventManagerServiceSpy},
        ],
      });
      service = TestBed.inject(HeaderTypeService);
    })
  );

  describe('createSubscriber', () => {
    it('should return subscriber from EventManagerService', () => {
      const subscriber = of({});
      eventManagerServiceSpy.createSubscriber.and.returnValue(subscriber);
      const result = service.createSubscriber();
      expect(eventManagerServiceSpy.createSubscriber).toHaveBeenCalledWith(
        'headerInfo'
      );
      expect(result).toEqual(subscriber);
    });
  });

  describe('publish', () => {
    it('should publish the headerInfo', () => {
      service[
        'headerInfoPublisher'
      ] = jasmine.createSpyObj('headerInfoPublisher', ['publish']);
      const headerInfo = {type: HeaderType.authorized};
      service.publish(headerInfo);
      expect(service['headerInfoPublisher'].publish).toHaveBeenCalledWith(
        headerInfo
      );
    });
  });
});
