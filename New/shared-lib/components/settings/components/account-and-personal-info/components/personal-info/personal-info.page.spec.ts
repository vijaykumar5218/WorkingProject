import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {of} from 'rxjs';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {PersonalInfoPage} from './personal-info.page';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('PersonalInfoPage', () => {
  let component: PersonalInfoPage;
  let fixture: ComponentFixture<PersonalInfoPage>;
  let accountServiceSpy;
  let fetchSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getParticipant',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      utilityServiceSpy.getIsWeb.and.returnValue(Promise.resolve());

      TestBed.configureTestingModule({
        declarations: [PersonalInfoPage],
        imports: [HttpClientModule, RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(PersonalInfoPage);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'fetchParticipant');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isWeb', () => {
      component.isWeb = false;
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.isWeb).toEqual(true);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
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

  describe('ngOnDestroy', () => {
    it('should unsubscribe if there is a subscription', () => {
      component['subscription'] = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
