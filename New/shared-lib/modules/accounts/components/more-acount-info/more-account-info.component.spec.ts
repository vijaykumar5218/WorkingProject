import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {AccountService} from '@shared-lib/services/account/account.service';
import {MoreAccountInfoComponent} from './more-account-info.component';
import {ExternalLink} from '@shared-lib/services/account/models/accountres.model';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('MoreAccountInfoComponent', () => {
  let component: MoreAccountInfoComponent;
  let fixture: ComponentFixture<MoreAccountInfoComponent>;
  let fetchSpy;
  let accountServiceSpy;
  let accessServiceSpy;

  const externalLinksData: ExternalLink[] = [
    {
      id: 'ACCT_HISTORY_LANDING',
      popup: false,
      link: 'https://a.com',
      label: 'Account History',
    },
    {
      id: 'ACCT_CONTRIB',
      popup: false,
      link: 'https://b.com',
      label: 'Manage Contributions',
    },
    {
      id: 'ACCT_MINVEST',
      popup: false,
      link: 'https://c.com',
      label: 'Manage Investments',
    },
    {
      id: 'LOANS_WITHD_LANDING',
      popup: false,
      link: 'https://d.com',
      label: 'Loans & Withdrawals',
    },
    {
      id: 'plan_informationintroduction',
      popup: false,
      link: 'https://e.com',
      label: 'Plan Details',
    },
    {
      id: 'MY_PROFILE',
      popup: false,
      link: 'https://f.com',
      label: 'My Profile',
    },
  ];

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getExternalLinks',
        'openPwebAccountLink',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkWorkplaceAccess',
      ]);

      TestBed.configureTestingModule({
        declarations: [MoreAccountInfoComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MoreAccountInfoComponent);
      component = fixture.componentInstance;

      fetchSpy = spyOn(component, 'fetchData');
      fixture.detectChanges();
      component['subscription'] = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchData', () => {
      component.ngOnInit();
      expect(component.fetchData).toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    beforeEach(() => {
      fetchSpy.and.callThrough();
      accountServiceSpy.getExternalLinks.and.returnValue(
        of(externalLinksData).pipe()
      );
      spyOn(component, 'setExternalLinks');
    });

    it('should call getExternalLinks', async () => {
      await component.fetchData();
      expect(accountServiceSpy.getExternalLinks).toHaveBeenCalled();
      expect(component.setExternalLinks).toHaveBeenCalledWith(
        externalLinksData
      );
    });
  });

  describe('setExternalLinks', () => {
    it('should set items links and filter out txhistory', () => {
      component.setExternalLinks(externalLinksData);
      expect(component.externalLinks).toEqual([
        {
          id: 'ACCT_HISTORY_LANDING',
          popup: false,
          link: 'https://a.com',
          label: 'Account History',
        },
        {
          id: 'ACCT_CONTRIB',
          popup: false,
          link: 'https://b.com',
          label: 'Manage Contributions',
        },
        {
          id: 'ACCT_MINVEST',
          popup: false,
          link: 'https://c.com',
          label: 'Manage Investments',
        },
        {
          id: 'LOANS_WITHD_LANDING',
          popup: false,
          link: 'https://d.com',
          label: 'Loans & Withdrawals',
        },
        {
          id: 'plan_informationintroduction',
          popup: false,
          link: 'https://e.com',
          label: 'Plan Details',
        },
      ]);
    });
  });

  describe('itemClicked', () => {
    it('link should open in same tab when workplaceaccess is true', async () => {
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
      const item = {
        link:
          'http://a.com?url=http://b.com&PartnerId=http://c.com&target=http://c.com',
      } as ExternalLink;
      await component.itemClicked(item);
      expect(accessServiceSpy.checkWorkplaceAccess).toHaveBeenCalled();
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        'http://a.com?url=http://b.com&PartnerId=http://c.com&target=http://c.com',
        '_self'
      );
    });
    it('link should open in new tab when workplaceaccess is false', async () => {
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: false})
      );
      const item = {
        link:
          'http://a.com?url=http://b.com&PartnerId=http://c.com&target=http://c.com',
      } as ExternalLink;
      await component.itemClicked(item);
      expect(accessServiceSpy.checkWorkplaceAccess).toHaveBeenCalled();
      expect(accountServiceSpy.openPwebAccountLink).toHaveBeenCalledWith(
        'http://a.com?url=http://b.com&PartnerId=http://c.com&target=http://c.com'
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
