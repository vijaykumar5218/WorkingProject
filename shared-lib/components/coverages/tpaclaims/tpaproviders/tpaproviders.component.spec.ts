import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {IonicModule, ModalController} from '@ionic/angular';
import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {TPAClaimsData} from '@shared-lib/services/tpa-stream/models/tpa.model';
import {TPAStreamService} from '@shared-lib/services/tpa-stream/tpastream.service';
import {of} from 'rxjs';
import {TPAProvidersComponent} from './tpaproviders.component';
import * as pageText from './constants/text-data.json';
import {GroupingCategoryDetails} from '../../models/chart.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('TPAProvidersComponent', () => {
  let component: TPAProvidersComponent;
  let fixture: ComponentFixture<TPAProvidersComponent>;
  let loadSpy;
  let tpaServiceSpy;
  let routerSpy;
  let modalControllerSpy;
  let tpaTestData: TPAClaimsData;
  let utilityServiceSpy;
  const pagetext = pageText;

  beforeEach(
    waitForAsync(() => {
      tpaTestData = {
        memberId: 12345,
        carriers: [
          {
            carrierName: 'test carrier',
            carrierId: 223,
            payerId: 12345,
            logoUrl: 'http://test.com/test.png',
            connectionStatus: 'SUCCESS',
            loginProblem: 'valid',
            crawlStatus: 'SUCCESS',
            crawlCount: 20,
            totalOutOfPocketAmount: 20,
            claimsCount: 10,
          },
        ],
        groupingCategoryDetails: {} as GroupingCategoryDetails,
        claims: [
          {
            inNetwork: true,
            outOfPocketCost: 20,
            providerName: 'Test Provider',
            serviceDate: '2022-01-23',
            carrierName: 'Test Carrier',
          },
        ],
      };

      tpaServiceSpy = jasmine.createSpyObj('TPAStreamService', [
        'getTPAData',
        'revokeCarrier',
        'openTPAConnect',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      utilityServiceSpy.getIsWeb.and.returnValue(false);

      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

      TestBed.configureTestingModule({
        declarations: [TPAProvidersComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: TPAStreamService, useValue: tpaServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TPAProvidersComponent);
      component = fixture.componentInstance;

      loadSpy = spyOn(component, 'loadData');

      fixture.detectChanges();

      const spy = jasmine.createSpyObj('Sub', ['unsubscribe']);
      component['subscription'] = spy;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadData', () => {
      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('loadData', () => {
    beforeEach(() => {
      loadSpy.and.callThrough();
    });

    it('should load carriers', () => {
      tpaServiceSpy.getTPAData.and.returnValue(of(tpaTestData));

      component.loadData();

      expect(tpaServiceSpy.getTPAData).toHaveBeenCalled();
      expect(component.carriers).toEqual(tpaTestData.carriers);
      expect(component.memberId).toEqual(12345);
    });
  });

  describe('addCarrier', () => {
    it('should call tpaService openTPAConnect', () => {
      component.addCarrier();
      expect(tpaServiceSpy.openTPAConnect).toHaveBeenCalled();
    });
  });

  describe('goBack', () => {
    it('should call router.navigateByUrl if is web', () => {
      component.isWeb = true;
      component.goBack();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/all-coverages/tpaclaims'
      );
    });

    it('should call router.navigateByUrl if not web', () => {
      component.isWeb = false;
      component.goBack();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/coverage-tabs/tpaclaims'
      );
    });
  });

  describe('revoke', () => {
    let modalSpy;
    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
    });

    it('should open modal with the add carrier page', async () => {
      await component.revoke(12, 'Test Carrier Name');

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          titleMessage:
            pagetext.areYouSure + 'Test Carrier Name' + pagetext.qmark,
          yesButtonTxt: pagetext.revoke,
          noButtonTxt: pagetext.cancel,
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });

    it('should call tpaService revoke in save function and return true if success', async () => {
      tpaServiceSpy.revokeCarrier.and.returnValue(Promise.resolve(true));
      component.memberId = 12345;

      await component.revoke(12, 'Test Carrier Name');

      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;
      const result = await saveFunction();

      expect(tpaServiceSpy.revokeCarrier).toHaveBeenCalledWith(12, 12345);
      expect(tpaServiceSpy.getTPAData).toHaveBeenCalledWith(true);
      expect(component.carriers).toBeNull();
      expect(result).toBeTrue();
    });

    it('should call tpaService revoke in save function and return false if error', async () => {
      tpaServiceSpy.revokeCarrier.and.callFake(() => Promise.reject(false));
      component.memberId = 12345;

      await component.revoke(12, 'Test Carrier Name');

      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;
      const result = await saveFunction();

      expect(tpaServiceSpy.revokeCarrier).toHaveBeenCalledWith(12, 12345);
      expect(result).toBeFalse();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
