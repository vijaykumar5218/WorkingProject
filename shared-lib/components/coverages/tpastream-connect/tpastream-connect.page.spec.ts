import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {Environment} from '@shared-lib/models/environment.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import {QualtricsService} from '@shared-lib/services/qualtrics/qualtrics.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {of} from 'rxjs';
import {TPAStreamService} from '../../../services/tpa-stream/tpastream.service';
import {StreamStep, TPAStreamConnectPage} from './tpastream-connect.page';

describe('TPAStreamConnectPage', () => {
  let component: TPAStreamConnectPage;
  let fixture: ComponentFixture<TPAStreamConnectPage>;
  let utilityServiceSpy;
  let accountServiceSpy;
  let qualtricsServiceSpy;
  let displayTPASpy;
  let modalControllerSpy;
  let tpaServiceSpy;
  let subscriptionSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'getEnvironment',
        'getIsWeb',
        'navigateByUrl',
      ]);
      utilityServiceSpy.getIsWeb.and.returnValue(false);

      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getParticipant',
      ]);
      qualtricsServiceSpy = jasmine.createSpyObj('QualtricsService', [
        'getUserProperties',
      ]);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      tpaServiceSpy = jasmine.createSpyObj('TPAStreamService', ['getTPAData']);
      subscriptionSpy = jasmine.createSpyObj('Subscription', [
        'add',
        'unsubscribe',
      ]);
      TestBed.configureTestingModule({
        declarations: [TPAStreamConnectPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: QualtricsService, useValue: qualtricsServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: TPAStreamService, useValue: tpaServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TPAStreamConnectPage);
      component = fixture.componentInstance;
      component.subscription = subscriptionSpy;
      displayTPASpy = spyOn(component, 'displayTPA');

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call displayTPAStreamConnect', () => {
      expect(component.displayTPA).toHaveBeenCalledWith('#tpa-stream');
    });
  });

  describe('displayTPA', () => {
    let participant;
    let qualProps;

    beforeEach(() => {
      displayTPASpy.and.callThrough();
      participant = {
        firstName: 'TestFirst',
        lastName: 'TestLast',
        birthDate: '01/01/1990',
        displayName: 'DisplayName',
        age: '50',
        profileId: 'aaa-bbb-ccc-ddd',
      };
      qualProps = {
        clientDomain: 'com.test',
        clientId: 'INGWIN',
        clientName: 'Test Client',
        email: 'test@test.com',
        enableMyVoyage: 'Y',
        firstTimeLogin: false,
        mobile: '111-222-3333',
        partyId: 'aaa-bbb-ccc-ddd',
        planIdList: [],
        currentPlan: null,
      };

      utilityServiceSpy.getEnvironment.and.returnValue({
        tpaPrefix: 'INTG-',
        tpaSdk: '123-456-abc-ddd',
      } as Environment);
      accountServiceSpy.getParticipant.and.returnValue(of(participant));
      qualtricsServiceSpy.getUserProperties.and.returnValue(
        Promise.resolve(qualProps)
      );

      spyOn(component, 'setStep');
    });

    it('should call utlityService to get env, then call getParticipant, and then call getUserProps, then pass to streamConnect', async () => {
      const spy = jasmine.createSpy('StreamConnect');
      await component.displayTPA('#test-el', spy);

      expect(spy).toHaveBeenCalledWith({
        el: '#test-el',
        isDemo: false,
        sdkToken: '123-456-abc-ddd',
        user: {
          firstName: 'TestFirst',
          lastName: 'TestLast',
          email: 'aaa-bbb-ccc-ddd@voya.com',
          memberSystemKey: 'aaa-bbb-ccc-ddd',
        },
        employer: {
          name: 'INTG-Test Client',
          systemKey: 'INTG-INGWIN',
          vendor: 'internal',
        },
        doneGetSDK: jasmine.any(Function),
        doneChoosePayer: jasmine.any(Function),
        doneTermsOfService: jasmine.any(Function),
        doneCreatedForm: jasmine.any(Function),
        donePostCredentials: jasmine.any(Function),
        doneRealTime: jasmine.any(Function),
        donePopUp: jasmine.any(Function),
        doneEasyEnroll: jasmine.any(Function),
        handleFormErrors: jasmine.any(Function),
        userSchema: {},
      });
    });

    it('should set proper step on doneGetSDK', async () => {
      const spy = jasmine.createSpy('StreamConnect');
      await component.displayTPA('#test-el', spy);

      spy.calls.all()[0].args[0].doneGetSDK();
      expect(component.setStep).toHaveBeenCalledWith(StreamStep.LOAD);
    });

    it('should set proper step on doneChoosePayer', async () => {
      const spy = jasmine.createSpy('StreamConnect');
      await component.displayTPA('#test-el', spy);

      spy.calls.all()[0].args[0].doneChoosePayer();
      expect(component.setStep).toHaveBeenCalledWith(StreamStep.CHOOSE_PAYER);
    });

    it('should set proper step on doneTermsOfService', async () => {
      const spy = jasmine.createSpy('StreamConnect');
      await component.displayTPA('#test-el', spy);

      spy.calls.all()[0].args[0].doneTermsOfService();
      expect(component.setStep).toHaveBeenCalledWith(
        StreamStep.TERMS_OF_SERVICE
      );
    });

    it('should set proper step on doneCreatedForm', async () => {
      const spy = jasmine.createSpy('StreamConnect');
      await component.displayTPA('#test-el', spy);

      spy.calls.all()[0].args[0].doneCreatedForm();
      expect(component.setStep).toHaveBeenCalledWith(StreamStep.CREATED_FORM);
    });

    it('should set proper step on donePostCredentials', async () => {
      const spy = jasmine.createSpy('StreamConnect');
      await component.displayTPA('#test-el', spy);

      spy.calls.all()[0].args[0].donePostCredentials();
      expect(component.setStep).toHaveBeenCalledWith(StreamStep.POST_CREDS);
    });

    it('should set proper step on doneRealTime', async () => {
      const spy = jasmine.createSpy('StreamConnect');
      await component.displayTPA('#test-el', spy);

      spy.calls.all()[0].args[0].doneRealTime();
      expect(component.setStep).toHaveBeenCalledWith(StreamStep.REAL_TIME);
    });

    it('should set proper step on donePopUp', async () => {
      const spy = jasmine.createSpy('StreamConnect');
      await component.displayTPA('#test-el', spy);

      spy.calls.all()[0].args[0].donePopUp();
      expect(component.setStep).toHaveBeenCalledWith(StreamStep.POPUP);
    });

    it('should set proper step on doneEasyEnroll', async () => {
      const spy = jasmine.createSpy('StreamConnect');
      await component.displayTPA('#test-el', spy);

      spy.calls.all()[0].args[0].doneEasyEnroll();
      expect(component.setStep).toHaveBeenCalledWith(StreamStep.DONE_ENROLL);
    });

    it('should set proper step on handleFormErrors', async () => {
      const spy = jasmine.createSpy('StreamConnect');
      await component.displayTPA('#test-el', spy);

      spy.calls.all()[0].args[0].handleFormErrors();
      expect(component.setStep).toHaveBeenCalledWith(StreamStep.FORM_ERROR);
    });
  });

  describe('setStep', () => {
    it('should call ngZone.run and then set the step', () => {
      spyOn(component['ngZone'], 'run').and.callFake(f => f());

      component.setStep(StreamStep.POPUP);
      expect(component.step).toEqual(StreamStep.POPUP);
    });
  });

  describe('closeClicked', () => {
    it('should call modalcontroller dismiss if not web', () => {
      component.isWeb = false;
      component.closeClicked();
      expect(tpaServiceSpy.getTPAData).toHaveBeenCalledWith(true);
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });

    it('should call navigate if web', () => {
      component.isWeb = true;
      component.closeClicked();
      expect(tpaServiceSpy.getTPAData).toHaveBeenCalledWith(true);
      expect(utilityServiceSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/all-coverages/tpaclaims'
      );
    });
  });

  it('ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component.subscription.unsubscribe).toHaveBeenCalled();
  });
});
