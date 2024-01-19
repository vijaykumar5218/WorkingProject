import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {AlertWindow} from '../../../../data/schema/AlterWindow';
import {AlertWindowService} from './alert-window.service';
import * as text from './constants/alertText.json';

describe('AlertWindowService', () => {
  const pageText: Record<string, string> = text;

  let service: AlertWindowService;
  let alertControllerSpy;
  let routerSpy;

  beforeEach(() => {
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: AlertController, useValue: alertControllerSpy},
        {provide: Router, useValue: routerSpy},
      ],
    }).compileComponents();
    service = TestBed.inject(AlertWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('presentAlert', () => {
    it('should present alert with passed options', async () => {
      const alertSpy = jasmine.createSpyObj('Alert', [
        'present',
        'onDidDismiss',
      ]);
      alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));
      alertSpy.onDidDismiss.and.returnValue(Promise.resolve());

      const alertOptions: AlertWindow = {
        header: 'header',
        subHeader: 'subHeader',
        message: 'message',
        buttons: ['b1', 'b2'],
        link: 'link',
        cssClass: 'cssClass',
        backdropDismiss: false,
      };

      await service.presentAlert(alertOptions);

      expect(alertControllerSpy.create).toHaveBeenCalledWith({
        cssClass: alertOptions.cssClass,
        header: alertOptions.header,
        subHeader: alertOptions.subHeader,
        message: alertOptions.message,
        buttons: alertOptions.buttons,
        backdropDismiss: false,
      });

      expect(alertSpy.present).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(alertOptions.link);
    });

    it('should present alert with some default options', async () => {
      const alertSpy = jasmine.createSpyObj('Alert', [
        'present',
        'onDidDismiss',
      ]);
      alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));
      alertSpy.onDidDismiss.and.returnValue(Promise.resolve());

      const alertOptions: AlertWindow = {
        message: null,
      };

      await service.presentAlert(alertOptions);

      expect(alertControllerSpy.create).toHaveBeenCalledWith({
        cssClass: 'alert-window',
        header: pageText.systemUnavailable,
        subHeader: '',
        message: pageText.youMustUse,
        buttons: ['OK'],
        backdropDismiss: true,
      });

      expect(alertSpy.present).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalledWith(
        alertOptions.link
      );
    });
  });

  describe('createAndPresent', () => {
    it('should create and present', async () => {
      const alertSpy = jasmine.createSpyObj('Alert', ['present']);
      alertControllerSpy.create.and.returnValue(Promise.resolve(alertSpy));

      await service.createAndPresent({});

      expect(alertControllerSpy.create).toHaveBeenCalledWith({});
      expect(alertSpy.present).toHaveBeenCalled();
    });
  });
});
