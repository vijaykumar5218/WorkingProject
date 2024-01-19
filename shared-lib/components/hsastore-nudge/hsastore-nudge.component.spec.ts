import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {HSAStoreNudgeComponent} from './hsastore-nudge.component';
import {AlertComponent} from '../alert/alert.component';
import {HSAStorePage} from '@shared-lib/modules/accounts/hsastore/hsastore.page';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {NoBenefitContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('HSAStoreNudgeComponent', () => {
  let component: HSAStoreNudgeComponent;
  let fixture: ComponentFixture<HSAStoreNudgeComponent>;
  let modalControllerSpy;
  let utilityServiceSpy;
  let accountServiceSpy;
  let benefitsServiceSpy;
  let accessServiceSpy;
  let fetchHsaStoreEnabledSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      utilityServiceSpy.getIsWeb.and.returnValue(true);

      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getHSAorFSA',
      ]);
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getNoBenefitContents',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);

      TestBed.configureTestingModule({
        declarations: [HSAStoreNudgeComponent],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(HSAStoreNudgeComponent);
      component = fixture.componentInstance;

      fetchHsaStoreEnabledSpy = spyOn(component, 'fetchHsaStoreEnabled');

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchHsaStoreEnabled', () => {
      expect(component.fetchHsaStoreEnabled).toHaveBeenCalled();
    });
  });

  describe('fetchHsaStoreEnabled', () => {
    beforeEach(() => {
      fetchHsaStoreEnabledSpy.and.callThrough();
      spyOn(component, 'fetchData');
    });
    it('when hsaStoreEnabled will be true', async () => {
      const data: any = {hsaStoreEnabled: true};
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(data)
      );
      await component.fetchHsaStoreEnabled();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.fetchData).toHaveBeenCalled();
    });
    it('when hsaStoreEnabled will be false', async () => {
      const data: any = {hsaStoreEnabled: false};
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(data)
      );
      await component.fetchHsaStoreEnabled();
      expect(component.fetchData).not.toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    let content;
    beforeEach(() => {
      accountServiceSpy.getHSAorFSA.and.returnValue(
        Promise.resolve({
          hsa: false,
          false: false,
        })
      );

      content = {
        discTitle: 'title',
        discMessage: 'message',
        discOkay: 'okay',
        discNo: 'no',
      };
      const benContent = {
        HSA_FSA_Store_Disclosure_Modal: JSON.stringify(content),
      } as NoBenefitContent;
      benefitsServiceSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve(benContent)
      );
    });

    it('should set show to true if fromJourney', async () => {
      component.fromJourney = true;
      accountServiceSpy.getHSAorFSA.and.returnValue(
        Promise.resolve({
          hsa: false,
          false: false,
        })
      );

      await component.fetchData();
      expect(component.show).toBeTrue();
    });

    it('should call getHSAorFSA and set show if either hsa or fsa is true', async () => {
      accountServiceSpy.getHSAorFSA.and.returnValue(
        Promise.resolve({
          hsa: true,
          false: false,
        })
      );

      await component.fetchData();
      expect(component.show).toBeTrue();
    });

    it('should call getHSAorFSA and set show to false if neither hsa or fsa is true', async () => {
      accountServiceSpy.getHSAorFSA.and.returnValue(
        Promise.resolve({
          hsa: false,
          false: false,
        })
      );

      await component.fetchData();
      expect(component.show).toBeFalse();
    });

    it('should fetch benefits content set that to content property', async () => {
      await component.fetchData();
      expect(benefitsServiceSpy.getNoBenefitContents).toHaveBeenCalled();
      expect(component.content).toEqual(content);
    });
  });

  describe('openStoreDisclaimer', () => {
    let modalSpy;

    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));

      component.content = {
        discTitle: 'title',
        discMessage: 'message',
        discOkay: 'okay',
        discNo: 'no',
      };
    });

    it('should open modal disclaimer with class for mobile', async () => {
      component.isWeb = false;
      await component.openStoreDisclaimer();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-total-fullscreen',
        componentProps: {
          titleMessage: 'title',
          message: 'message',
          yesButtonTxt: 'okay',
          noButtonTxt: 'no',
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });

    it('should open modal disclaimer with class for web', async () => {
      component.isWeb = true;
      await component.openStoreDisclaimer();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          titleMessage: 'title',
          message: 'message',
          yesButtonTxt: 'okay',
          noButtonTxt: 'no',
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });

    it('saveFunction should call openStore and return true', async () => {
      spyOn(component, 'openStore');

      await component.openStoreDisclaimer();

      const saveFunc = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;
      const res = await saveFunc();

      expect(component.openStore).toHaveBeenCalled();
      expect(res).toBeTrue();
    });
  });

  describe('openStore', () => {
    let modalSpy;
    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
    });

    it('should open modal for mobile', async () => {
      component.isWeb = false;
      await component.openStore();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: HSAStorePage,
        cssClass: 'modal-fullscreen',
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });

    it('should open modal for web', async () => {
      component.isWeb = true;
      await component.openStore();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: HSAStorePage,
        cssClass: 'modal-not-fullscreen-large',
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });
});
