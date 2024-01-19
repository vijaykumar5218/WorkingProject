import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {BaseService} from '../base/base-factory-provider';
import {SharedUtilityService} from '../utility/utility.service';
import {NotificationService} from './notification.service';
import {endPoints} from './constants/endpoints';
import {ReplaySubject} from 'rxjs';
import {NotificationCount} from './models/notification.model';

describe('NotificationService', () => {
  let service;
  let baseServiceSpy;
  let utilityServiceSpy;

  beforeEach(() => {
    baseServiceSpy = jasmine.createSpyObj('BaseService', ['get', 'post']);

    utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
      'appendBaseUrlToEndpoints',
    ]);

    utilityServiceSpy.appendBaseUrlToEndpoints.and.returnValue(endPoints);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
        {provide: BaseService, useValue: baseServiceSpy},
      ],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNotification', () => {
    let notificationData;
    beforeEach(() => {
      notificationData = {
        highPriority: [],
        recent: [],
      };
      baseServiceSpy.get.and.returnValue(notificationData);
    });

    it('should call baseservice get on first call', async () => {
      const result = await service.getNotification();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/person/eventcategory'
      );
      expect(result).toEqual(notificationData);
    });

    it('should return notificationData', async () => {
      const result = await service.getNotification();
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(notificationData);
    });
  });

  describe('savePageVisit', () => {
    it('should call baseService post with payload for save page visit notification response', () => {
      service.savePageVisit();

      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoyage/ws/ers/service/savePageVisit',
        {
          pageName: 'BELL',
          actionPerformed: 'VISITED',
        }
      );
    });
  });

  describe('initializeNotificationCount', () => {
    beforeEach(() => {
      let i = 0;
      baseServiceSpy.get.and.callFake(() => {
        i++;
        return i - 1;
      });
      spyOn(service['notificationCountSubject'], 'next');
    });

    it('should get the count and set up the listener for every min', fakeAsync(() => {
      service.initializeNotificationCount();
      tick(180000);
      clearInterval(service['interval']);
      expect(baseServiceSpy.get).toHaveBeenCalledTimes(4);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endPoints.notificationCount
      );
      expect(service['notificationCountSubject'].next).toHaveBeenCalledWith(0);
      expect(service['notificationCountSubject'].next).toHaveBeenCalledWith(1);
      expect(service['notificationCountSubject'].next).toHaveBeenCalledWith(2);
      expect(service['notificationCountSubject'].next).toHaveBeenCalledWith(3);
    }));

    it('should wait for pageVisitPromise if there is one', fakeAsync(() => {
      service['pageVisitPromise'] = new Promise<void>(r => {
        setTimeout(() => r(), 59000);
      });
      service.initializeNotificationCount();
      tick(58000);
      expect(service['notificationCountSubject'].next).not.toHaveBeenCalled();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      tick(10000);
      clearInterval(service['interval']);
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        endPoints.notificationCount
      );
      expect(service['notificationCountSubject'].next).toHaveBeenCalledWith(0);
    }));
  });

  describe('getNotificationCount', () => {
    it('should return the observable', () => {
      const subject = new ReplaySubject<NotificationCount>(1);
      service['notificationCountSubject'] = subject;
      const result = service.getNotificationCount();
      expect(result).toEqual(subject);
    });
  });

  describe('clearCountInterval', () => {
    it('should clear the count interval', () => {
      const interval = jasmine.createSpyObj('interval', ['']);
      service['interval'] = interval;
      spyOn(window, 'clearInterval');
      service.clearCountInterval();
      expect(clearInterval).toHaveBeenCalledWith(interval);
    });
  });
});
