import {AlertComponent} from '@shared-lib/components/alert/alert.component';
import {EditDisplayNameService} from '@shared-lib/services/edit-display-name/edit-display-name.service';
import {EditDisplayNamePage} from './edit-display-name.page';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {of} from 'rxjs';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {Router} from '@angular/router';
import * as pageText from '@shared-lib/services/edit-display-name/constants/displayText.json';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

describe('EditDisplayNamePage', () => {
  let component: EditDisplayNamePage;
  let fixture: ComponentFixture<EditDisplayNamePage>;
  const displayText = JSON.parse(JSON.stringify(pageText)).default;
  let accountServiceSpy;
  let fetchSpy;
  let headerTypeServiceSpy;
  let editDisplayNameServiceSpy;
  let routerSpy;
  let modalControllerSpy;
  let utilityServiceSpy;
  let platformServiceSpy;

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getParticipant',
        'setParticipant',
      ]);
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      routerSpy = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };
      modalControllerSpy = jasmine.createSpyObj('ModalController', [
        'create',
        'onDidDismiss',
      ]);
      editDisplayNameServiceSpy = jasmine.createSpyObj(
        'EditDisplayNameServiceSpy',
        ['saveDisplayName']
      );
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);

      TestBed.configureTestingModule({
        declarations: [EditDisplayNamePage],
        imports: [HttpClientModule, RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: Router, useValue: routerSpy},
          {
            provide: EditDisplayNameService,
            useValue: editDisplayNameServiceSpy,
          },
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(EditDisplayNamePage);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'fetchParticipant');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Edit Display Name',
        btnleft: true,
        btnright: true,
        buttonLeft: {
          name: '',
          link: 'settings/account-and-personal-info',
        },
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
      expect(component.fetchParticipant).toHaveBeenCalledWith();
    });
  });

  describe('fetchParticipant', () => {
    let data;
    beforeEach(() => {
      fetchSpy.and.callThrough();
      data = {
        firstName: 'Jae',
        lastName: 'Kin',
        displayName: 'D',
        age: '68',
        nameDobDiff: false,
        birthDate: '03/26/1993',
        profileId: 'sdasd-sdasd-fdgdg-sdfsfs',
      };
      accountServiceSpy.getParticipant.and.returnValue(Promise.resolve(data));
      accountServiceSpy.getParticipant.and.returnValue(of(data).pipe());
    });

    it('should call getparticipant from accountservice and return participant data', async () => {
      await component.fetchParticipant();
      expect(accountServiceSpy.getParticipant).toHaveBeenCalled();
      expect(component.participantData).toEqual(data);
    });
  });

  describe('cancel', () => {
    it('when isWeb would be false', () => {
      component.isWeb = false;
      component.cancel();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/settings/account-and-personal-info'
      );
    });
    it('when isWeb would be true and isDesktop would be false', () => {
      component.isWeb = true;
      component.isDesktop = false;
      component.cancel();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/more/account-and-personal-info'
      );
    });
  });

  describe('valueChanged', () => {
    it('if displayName name is valid ', () => {
      component.displayName = 'John';
      component.displayNameVailid = true;
      component.valueChanged('John');
      expect(component.displayName).toEqual('John');
      expect(component.displayNameVailid).toEqual(true);
    });

    it('if displayName name is not valid ', () => {
      component.displayName = '  ';
      component.displayNameVailid = false;
      component.valueChanged('');
      expect(component.displayName).toEqual('');
      expect(component.displayNameVailid).toEqual(false);
    });
  });

  describe('saveDisplayName', () => {
    it('should show the alert modal for confirmation of save of display name', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );
      await component.saveDisplayName();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AlertComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          titleMessage: displayText.alert.message,
          imageUrl: displayText.alert.imageUrl,
          saveFunction: jasmine.any(Function),
        },
      });
      expect(modal.present).toHaveBeenCalled();
    });

    it('should properly use save function', async () => {
      const modal = jasmine.createSpyObj('HTMLIonModalElement', [
        'present',
        'onDidDismiss',
      ]);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modal));
      modal.onDidDismiss.and.returnValue(
        Promise.resolve({
          data: {
            saved: false,
          },
        })
      );
      await component.saveDisplayName();

      const saveFunction = modalControllerSpy.create.calls.all()[0].args[0]
        .componentProps.saveFunction;

      component.displayName = 'AILIN-DP, VILJAMI';

      component.participantData = {
        firstName: 'Joseph',
        lastName: 'lastName',
        birthDate: '',
        displayName: '',
        age: '',
        nameDobDiff: false,
        profileId: 'profileId',
      };

      editDisplayNameServiceSpy.saveDisplayName.and.returnValue(
        Promise.resolve({
          person: {
            mdmId: 'c8b5d8d3-d787-02f7-e053-8462cc0ae14e',
            partyId: 'c8b5d8d3-d787-02f7-e053-8462cc0ae14e',
            birthDt: '1961-08-08',
            fullName: 'AILIN-DP, VILJAMI',
            firstName: 'VILJAMI',
            middleName: 'J',
            lastName: 'AILIN-DP',
            primaryStreetAddr: '493 GOREE-DP',
            primaryAddrLine1: '493 GOREE-DP',
            primaryAddrCity: 'SHOREWOOD',
            primaryAddrStateCode: 'MN',
            primaryAddrPostalCode: '55331',
            primaryCountryCode: 'US',
            primaryCountyName: 'UNITED STATES',
            displayName: 'AILIN-DP, VILJAMI',
            gender: 'MALE',
            mdmSearchEnabledFlag: 'Y',
          },
        })
      );

      const result = await saveFunction();
      expect(editDisplayNameServiceSpy.saveDisplayName).toHaveBeenCalledWith(
        component.displayName
      );
      expect(result).toEqual(false);

      editDisplayNameServiceSpy.saveDisplayName.and.returnValue(
        Promise.resolve({
          error: 'error',
        })
      );

      const result2 = await saveFunction();
      expect(editDisplayNameServiceSpy.saveDisplayName).toHaveBeenCalledWith(
        component.displayName
      );
      expect(result2).toEqual(false);
    });
  });

  describe('modalDismissed', () => {
    let data;
    beforeEach(() => {
      data = {
        firstName: 'Joseph',
        lastName: 'lastName',
        birthDate: '',
        displayName: '',
        age: '',
        nameDobDiff: false,
        profileId: 'profileId',
      };

      component.participantData = data;
      component.displayName = 'AILIN-DP, VILJAMI';
    });

    it('should call cancel and set new ParticipantData if data saved', () => {
      spyOn(component, 'cancel');
      component.modalDismissed({
        data: {
          saved: true,
        },
      });
      const newData = {
        firstName: 'Joseph',
        lastName: 'lastName',
        birthDate: '',
        displayName: 'AILIN-DP, VILJAMI',
        age: '',
        nameDobDiff: false,
        profileId: 'profileId',
      };

      expect(component.participantData).toEqual(newData);
      expect(accountServiceSpy.setParticipant).toHaveBeenCalledWith(newData);
      expect(component.cancel).toHaveBeenCalled();
    });

    it('should call cancel and not set ParticipantData if data saved', () => {
      spyOn(component, 'cancel');
      component.modalDismissed({
        data: {
          saved: false,
        },
      });
      expect(component.cancel).not.toHaveBeenCalled();
      expect(accountServiceSpy.setParticipant).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.subscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
