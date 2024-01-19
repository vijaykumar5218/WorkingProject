import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {SubHeaderTab} from '@shared-lib/models/tab-sub-header.model';
import {AccountService} from '@shared-lib/services/account/account.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {RetirementAccountPage} from './retirement-account.page';

describe('RetirementAccountPage', () => {
  let component: RetirementAccountPage;
  let fixture: ComponentFixture<RetirementAccountPage>;
  let headerTypeServiceSpy;
  let accountServiceSpy;
  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getAccount',
      ]);
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      TestBed.configureTestingModule({
        declarations: [RetirementAccountPage],
        imports: [HttpClientModule, RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(RetirementAccountPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the tabs for the sub header', () => {
      expect(component.tabs).toEqual([
        {label: 'Info', link: 'info'},
        {
          label: 'Transactions',
          link: 'transactions',
        },
        {label: '', link: ''},
      ]);
    });
  });

  describe('ionViewWillEnter', () => {
    it('ionViewWillEnter', () => {
      component.actionOption = {headername: ''};
      accountServiceSpy.getAccount.and.returnValue({
        accountTitle: 'Retirement',
      });
      component.ionViewWillEnter();
      expect(component.actionOption.headername).toEqual('Retirement');
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: {headername: 'Retirement'},
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

  describe('template', () => {
    it('should display the tabs sub header', () => {
      expect(fixture.debugElement.query(By.css('ion-tabs'))).toBeTruthy();
    });
  });
});
