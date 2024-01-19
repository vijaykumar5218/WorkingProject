import {Component} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {OMStatus} from '@shared-lib/services/account/models/orange-money.model';
import {InfoPage} from '@shared-lib/modules/accounts/retirement/info/info.page';
import {OrangeMoneyService} from '../../services/orange-money.service';
import {MadlibModalComponent} from '../madlib-modal/madlib-modal.component';

import {MadLibComponent} from './mad-lib.component';

@Component({selector: 'ion-card-contents', template: ''})
class MockIonCardContents {}

describe('MadLibComponent', () => {
  let component: MadLibComponent;
  let fixture: ComponentFixture<MadLibComponent>;
  const orangeMoneyServiceSpy = jasmine.createSpyObj('OrangeMoneyService', [
    'getOrangeData',
    'getOrangeMoneyStatus',
  ]);
  const modalControllerSpy = jasmine.createSpyObj('ModalController', [
    'create',
  ]);
  const infoPageSpy = jasmine.createSpyObj('InfoPage', ['scrollToOrangeMoney']);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MadLibComponent, MockIonCardContents],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: InfoPage, useValue: infoPageSpy},
          {provide: OrangeMoneyService, useValue: orangeMoneyServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MadLibComponent);
      component = fixture.componentInstance;
      orangeMoneyServiceSpy.getOrangeData.and.returnValue(of({}));
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchData', () => {
      spyOn(component, 'fetchData');
      component.ngOnInit();
      expect(component.fetchData).toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    beforeEach(() => {
      orangeMoneyServiceSpy.getOrangeData.and.returnValue(
        of({}).pipe(delay(1))
      );
    });

    it('shoould set values for status ORANGE_DATA', fakeAsync(() => {
      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.ORANGE_DATA
      );

      component.headerText = 'a';
      component.bodyText = 'b';
      component.hideButton = false;

      component.fetchData();

      tick(1);

      expect(component.headerText).toEqual('');
      expect(component.bodyText).toEqual('');
      expect(component.hideButton).toEqual(true);
    }));

    it('shoould set values for status FE_DATA', fakeAsync(() => {
      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.FE_DATA
      );

      component.headerText = 'a';
      component.bodyText = 'b';
      component.hideButton = false;

      component.fetchData();

      tick(1);

      expect(component.headerText).toEqual('');
      expect(component.bodyText).toEqual('');
      expect(component.hideButton).toEqual(true);
    }));

    it('shoould set values for status MADLIB_OM', fakeAsync(() => {
      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.MADLIB_OM
      );

      component.headerText = 'a';
      component.bodyText = 'b';
      component.hideButton = true;

      component.fetchData();

      tick(1);

      expect(component.headerText).toEqual(
        'See if you’re on track for retirement!'
      );
      expect(component.bodyText).toEqual(
        'With just a few steps you can check your progress toward your monthly retirement income goals'
      );
      expect(component.hideButton).toEqual(false);
    }));

    it('shoould set values for status MADLIB_FE', fakeAsync(() => {
      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.MADLIB_FE
      );

      component.headerText = 'aaaa';
      component.bodyText = 'bbbbb';
      component.hideButton = false;

      component.fetchData();

      tick(1);

      expect(component.headerText).toEqual('');
      expect(component.bodyText).toEqual(
        'Visit our website to find out if your Retirement Income will be ready when you are'
      );
      expect(component.hideButton).toEqual(true);
    }));

    it('shoould set values for status SERVICE_DOWN', fakeAsync(() => {
      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.SERVICE_DOWN
      );

      component.headerText = 'aaaa';
      component.bodyText = 'bbbbb';
      component.hideButton = false;

      component.fetchData();

      tick(1);

      expect(component.headerText).toEqual('');
      expect(component.bodyText).toEqual(
        'Visit our website to find out if your Retirement Income will be ready when you are'
      );
      expect(component.hideButton).toEqual(true);
    }));

    it('shoould set values for status UNKNOWN', fakeAsync(() => {
      orangeMoneyServiceSpy.getOrangeMoneyStatus.and.returnValue(
        OMStatus.UNKNOWN
      );

      component.headerText = 'aaaa';
      component.bodyText = 'bbbbb';
      component.hideButton = false;

      component.fetchData();

      tick(1);

      expect(component.headerText).toEqual('');
      expect(component.bodyText).toEqual(
        'Visit our website to find out if your Retirement Income will be ready when you are'
      );
      expect(component.hideButton).toEqual(true);
    }));
  });

  describe('openMadlibModal', () => {
    it('should open madlib modal', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modal.onDidDismiss.and.returnValue(Promise.resolve({}));
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));

      await component.openMadlibModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: MadlibModalComponent,
        cssClass: 'modal-not-fullscreen',
      });
      expect(modal.present).toHaveBeenCalled();
    });
  });
});
