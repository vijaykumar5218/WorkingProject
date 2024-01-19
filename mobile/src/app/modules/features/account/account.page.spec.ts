import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {AccountPage, ACCOUNT_LIFECYCLE_EVENTS} from './account.page';
import {AccountService} from '@shared-lib/services/account/account.service';
import {of, Subscription} from 'rxjs';
import {SubHeaderTab} from '@shared-lib/models/tab-sub-header.model';
import {EventManagerService} from '@shared-lib/modules/event-manager/event-manager/event-manager.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('AccountPage', () => {
  let component: AccountPage;
  let fixture: ComponentFixture<AccountPage>;
  let headerTypeServiceSpy;
  let accountServiceSpy;
  let eventManagerServiceSpy;
  let publisherSpy;
  let mxServiceSpy;
  let setupTabsSpy;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);

      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getAccount',
        'getSelectedTab$',
      ]);
      eventManagerServiceSpy = jasmine.createSpyObj('EventManagerService', [
        'createPublisher',
      ]);
      accountServiceSpy.getSelectedTab$.and.returnValue(of());

      publisherSpy = jasmine.createSpyObj('Publisher', ['publish']);
      eventManagerServiceSpy.createPublisher.and.returnValue(publisherSpy);

      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getIsMxUserByMyvoyageAccess',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);

      TestBed.configureTestingModule({
        declarations: [AccountPage],
        imports: [HttpClientModule, RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: EventManagerService, useValue: eventManagerServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountPage);
      component = fixture.componentInstance;
      setupTabsSpy = spyOn(component, 'setupTabs');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should create event publisher', () => {
      expect(eventManagerServiceSpy.createPublisher).toHaveBeenCalledWith(
        ACCOUNT_LIFECYCLE_EVENTS
      );
    });

    it('should call setupTabs', () => {
      expect(component.setupTabs).toHaveBeenCalled();
    });

    it('should subscribe to selectedTab', () => {
      component.selectedTabSubscription = undefined;
      const obsSpy = jasmine.createSpyObj('selectedTabObs', ['subscribe']);
      const subscription = new Subscription();
      obsSpy.subscribe.and.returnValue(subscription);
      accountServiceSpy.getSelectedTab$.and.returnValue(obsSpy);
      component.ngOnInit();
      expect(accountServiceSpy.getSelectedTab$).toHaveBeenCalled();
      expect(obsSpy.subscribe).toHaveBeenCalled();
      expect(component['selectedTabSubscription']).toEqual(subscription);
    });

    it('should set the selectedTab when account service publishes new tab', () => {
      accountServiceSpy.getSelectedTab$.and.returnValue(of('abc'));
      component.selectedTab = undefined;
      component.ngOnInit();
      expect(component.selectedTab).toEqual('abc');
    });
  });

  describe('ionViewWillEnter', () => {
    it('should publish event for viewWillEnter', () => {
      component.ionViewWillEnter();
      expect(publisherSpy.publish).toHaveBeenCalledWith('viewWillEnter');
    });

    it('ionViewWillEnter', () => {
      const actionOption: ActionOptions = {
        headername: 'Accounts',
        btnright: true,
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
  });

  describe('setupTabs', () => {
    beforeEach(() => {
      setupTabsSpy.and.callThrough();
    });

    it('should check for isMxUser and isHealthOnly and add more tabs if !isHealthOnly', async () => {
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(false));
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isHealthOnly: false})
      );

      await component.setupTabs();

      expect(component.tabs).toEqual([
        {label: 'Summary', link: 'summary'},
        {
          label: 'Insights',
          link: 'insights',
        },
        {
          label: 'Transactions',
          link: 'account-transaction',
        },
      ]);
    });

    it('should check for isMxUser and isHealthOnly and add more tabs if isMxUser and !isHealthOnly', async () => {
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isHealthOnly: false})
      );

      await component.setupTabs();

      expect(component.tabs).toEqual([
        {label: 'Summary', link: 'summary'},
        {
          label: 'Insights',
          link: 'insights',
        },
        {
          label: 'Transactions',
          link: 'account-transaction',
        },
      ]);
    });

    it('should check for isMxUser and isHealthOnly and not add more tabs if isHealthOnly and !isMxUser', async () => {
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(false));
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isHealthOnly: true})
      );

      await component.setupTabs();

      expect(component.tabs).toEqual([{label: 'Summary', link: 'summary'}]);
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

  describe('ngOnDestroy', () => {
    it('should unsubscribe from selectedTabSubscription', () => {
      component.selectedTabSubscription = jasmine.createSpyObj(
        'selectedTabSubscription',
        ['unsubscribe']
      );
      component.subscription = jasmine.createSpyObj('selectedTabSubscription', [
        'unsubscribe',
      ]);

      component.ngOnDestroy();

      expect(component.selectedTabSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
