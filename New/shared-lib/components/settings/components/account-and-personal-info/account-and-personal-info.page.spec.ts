import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AccountAndPersonalInfoPage} from './account-and-personal-info.page';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {SubHeaderTab} from '@shared-lib/models/tab-sub-header.model';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

@Component({selector: 'app-personal-info', template: ''})
class MockAppPersonalInfo {}

@Component({selector: 'app-account-info', template: ''})
class MockAppAccountInfo {}

describe('AccountAndPersonalInfoPage', () => {
  let component: AccountAndPersonalInfoPage;
  let fixture: ComponentFixture<AccountAndPersonalInfoPage>;
  let headerTypeServiceSpy;
  let navigateByUrlSpy;
  let sharedUtilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      TestBed.configureTestingModule({
        declarations: [
          AccountAndPersonalInfoPage,
          MockAppPersonalInfo,
          MockAppAccountInfo,
        ],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountAndPersonalInfoPage);
      component = fixture.componentInstance;
      const routerstub: Router = TestBed.inject(Router);
      navigateByUrlSpy = spyOn(routerstub, 'navigateByUrl');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Personal & Account Info',
        btnleft: true,
        btnright: true,
        buttonLeft: {
          name: '',
          link: 'settings',
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
    });

    describe('when isWeb would be false', () => {
      beforeEach(() => {
        component.isWeb = false;
      });
      it(' should redirect to personal Info page when component.selecteTab="personal-info" ', () => {
        component.selectedTab = 'personal-info';
        component.ionViewWillEnter();
        expect(navigateByUrlSpy).toHaveBeenCalledWith(
          'settings/account-and-personal-info/personal-info'
        );
      });
      it(' should redirect to account Info page when component.selecteTab="account-info" ', () => {
        component.selectedTab = 'account-info';
        component.ionViewWillEnter();
        expect(navigateByUrlSpy).toHaveBeenCalledWith(
          'settings/account-and-personal-info/account-info'
        );
      });
    });
    describe('when isWeb would be true', () => {
      beforeEach(() => {
        component.isWeb = true;
      });
      it(' should redirect to personal Info page when component.selecteTab="personal-info" ', () => {
        component.selectedTab = 'personal-info';
        component.ionViewWillEnter();
        expect(navigateByUrlSpy).toHaveBeenCalledWith(
          'more/account-and-personal-info/personal-info'
        );
      });
    });
  });

  describe('handleClick', () => {
    it('should update the selected tab to the tab that was clicked using link if it is there', () => {
      const selectedTabLink = 'selectedTab';
      const selectedTab: SubHeaderTab = {link: selectedTabLink, label: 'label'};
      component.selectedTab = undefined;
      component.handleClick(selectedTab);
      expect(component.selectedTab).toEqual(selectedTabLink);
    });
  });
});
