import {TestBed} from '@angular/core/testing';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {of} from 'rxjs';
import {ErrorService} from './error.service';
import {AlertController, ToastController} from '@ionic/angular';
import * as errortext from './constants/errorText.json';

describe('ErrorService', () => {
  const errorText: Record<string, string> = errortext;
  let service: ErrorService;
  let routerSpy;
  let toastControllerSpy;
  const routeMockEvent = new NavigationStart(0, '/login');
  let alertControllerSpy;

  beforeEach(() => {
    toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
    routerSpy = {
      events: of(routeMockEvent),
    };
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: Router, useValue: routerSpy},
        {provide: ToastController, useValue: toastControllerSpy},
        {provide: AlertController, useValue: alertControllerSpy},
      ],
    }).compileComponents();
    service = TestBed.inject(ErrorService);
  });

  describe('initialize', () => {
    it('should call Network.addListener', async () => {
      spyOn(service, 'onNetworkError');
      spyOn(service, 'registerErrorListener');
      const networkSpy = jasmine.createSpyObj('Network', [
        'addListener',
        'getStatus',
      ]);
      networkSpy.getStatus.and.returnValue(
        Promise.resolve({connected: true, connectionType: 'cellular'})
      );

      await service.initialize(networkSpy);

      expect(networkSpy.addListener).toHaveBeenCalledWith(
        'networkStatusChange',
        jasmine.any(Function)
      );
      expect(networkSpy.getStatus).toHaveBeenCalled();
      expect(service.onNetworkError).toHaveBeenCalledWith({
        connected: true,
        connectionType: 'cellular',
      });
      expect(service.registerErrorListener).toHaveBeenCalled();
    });
  });

  describe('onNetworkError', () => {
    beforeEach(() => {
      spyOn(service['ngZone'], 'run').and.callFake(f => f());
    });

    it('should call ngZone run, and show alert if not connected', async () => {
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

      await service.onNetworkError({
        connected: false,
        connectionType: 'unknown',
      });

      expect(alertControllerSpy.create).toHaveBeenCalledWith({
        header: errorText.networkErrorTitle,
        message: errorText.networkErrorMessage,
        buttons: [errorText.dismiss],
      });
      expect(alertSpy.present).toHaveBeenCalled();
    });

    it('should call ngZone run, and not show alert if connected', () => {
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

      service.onNetworkError({connected: true, connectionType: 'unknown'});

      expect(alertControllerSpy.create).not.toHaveBeenCalledWith({
        header: errorText.networkErrorTitle,
        message: errorText.networkErrorMessage,
        buttons: [errorText.dismiss],
      });
      expect(alertSpy.present).not.toHaveBeenCalled();
    });
  });

  describe('registerErrorListener', () => {
    it('should listen for error events and subscribe to router events', () => {
      service.hasShownError = true;
      service.registerErrorListener();
      expect(service.hasShownError).toBeFalse();
    });

    it('should not set hasShownError to false if event is not a NavigationStart event', () => {
      service.hasShownError = true;
      routerSpy.events = of(new NavigationEnd(0, '/login', ''));
      service.registerErrorListener();
      expect(service.hasShownError).toBeTrue();
    });
  });
});
