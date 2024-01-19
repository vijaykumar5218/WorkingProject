import {TestBed} from '@angular/core/testing';
import {MyVoyageHeaderService} from './myvoyage-header.service';
import {of} from 'rxjs';
import {NotificationService} from '@shared-lib/services/notification/notification.service';
import {HelpService} from '@shared-lib/services/help/help.service';

describe('MyVoyageHeaderService', () => {
  let service;
  let helpServiceSpy;
  let notificationServiceSpy;

  beforeEach(() => {
    helpServiceSpy = jasmine.createSpyObj('HelpService', ['getCategoryData']);

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'getNotificationCount',
      'initializeNotificationCount',
      'clearCountInterval',
    ]);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: NotificationService, useValue: notificationServiceSpy},
        {provide: HelpService, useValue: helpServiceSpy},
      ],
    });
    service = TestBed.inject(MyVoyageHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNotificationCount', () => {
    it('should return the notificationService observable', () => {
      const obs = of({newNotificationCount: 2});
      notificationServiceSpy.getNotificationCount.and.returnValue(obs);
      const result = service.getNotificationCount();
      expect(result).toEqual(obs);
      expect(notificationServiceSpy.getNotificationCount).toHaveBeenCalled();
    });
  });

  describe('initializeNotificationCount', () => {
    it('should call notificationService initializeNotificationCount', () => {
      service.initializeNotificationCount();
      expect(
        notificationServiceSpy.initializeNotificationCount
      ).toHaveBeenCalled();
    });
  });

  describe('clearCountInterval', () => {
    it('should call notificationService clearCountInterval', () => {
      service.clearCountInterval();
      expect(notificationServiceSpy.clearCountInterval).toHaveBeenCalled();
    });
  });

  describe('getCategoryData', () => {
    it('should call helpService getCategoryData', () => {
      service.getCategoryData();
      expect(helpServiceSpy.getCategoryData).toHaveBeenCalled();
    });
  });
});
