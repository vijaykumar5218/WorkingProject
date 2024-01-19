import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AccessService} from '@shared-lib/services/access/access.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {of, Subscription} from 'rxjs';
import {AccountsAndCoveragesComponent} from './accounts-coverages.component';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';

describe('AccountsAndCoveragesComponent', () => {
  let component: AccountsAndCoveragesComponent;
  let fixture: ComponentFixture<AccountsAndCoveragesComponent>;
  let platformServiceSpy;
  let accessServiceSpy;
  const mockAccessData: any = {
    enableCoverages: false,
    isMyBenefitsUser:false
  };
  let benefitsServiceSpy;
  let fetchTileCoverageContentSpy;
  let mxServiceSpy;
  let fetchTileCoverageContentOfMyBenefitUserSpy;

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getIsMxUserByMyvoyageAccess',
      ]);
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(mockAccessData)
      );
      platformServiceSpy = jasmine.createSpyObj('platformServiceSpy', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));
      benefitsServiceSpy = jasmine.createSpyObj('benefitsServiceSpy', [
        'getNoBenefitContents',
        'getMBHBenefitDetails'
      ]);
      TestBed.configureTestingModule({
        declarations: [AccountsAndCoveragesComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: PlatformService, useValue: platformServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(AccountsAndCoveragesComponent);
      component = fixture.componentInstance;
      fetchTileCoverageContentSpy = spyOn(
        component,
        'fetchTileCoverageContent'
      );
      fetchTileCoverageContentOfMyBenefitUserSpy = spyOn(
        component,
        'fetchTileCoverageContentOfMyBenefitUser'
      )
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    let observable;
    let subscription;
    beforeEach(() => {
      subscription = new Subscription();
      observable = of(true);
      spyOn(component.subscription, 'add');
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(true);
        return subscription;
      });
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(observable);
    });
    it('should call getIsMxUserByMyvoyageAccess & set the value of isMXUser', () => {
      component.ngOnInit();
      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalled();
      expect(component.isMXUser).toEqual(true);
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
    });
    it('should set the value of isCoverageAccessible', async () => {
      await component.ngOnInit();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.isCoverageAccessible).toEqual(false);
      expect(component.isMyBenefitsUser).toEqual(false);
    });
    it('should not call fetchTileCoverageContent when enableCoverages will be false', async () => {
      await component.ngOnInit();
      expect(component.fetchTileCoverageContent).not.toHaveBeenCalled();
    });
    it('should call fetchTileCoverageContent when enableCoverages will be true', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableCoverages: true})
      );
      await component.ngOnInit();
      expect(component.fetchTileCoverageContent).toHaveBeenCalled();
    });

    it('should not call fetchTileCoverageContentOfMyBenefitUser when myBenefits will be false', async() => {
      await component.ngOnInit();
      expect(component.fetchTileCoverageContentOfMyBenefitUser).not.toHaveBeenCalled();
    })
    it('should call fetchTileCoverageContentOfMyBenefitUser when myBenefits will be true', async () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isMyBenefitsUser :true})
      );
      await component.ngOnInit();
      expect(component.fetchTileCoverageContentOfMyBenefitUser).toHaveBeenCalled();
    })
  });

  describe('fetchTileCoverageContent', () => {
    const mockCoverageContentData: any = {
      workplacedashboardTile: '{"title":"Claims & Coverages"}',
    };
    const mockTabContent =
      '[{"label":"Accounts","id":"accounts"},{"label":"Claims & Coverages","id":"claim-coverages"}]';
    beforeEach(() => {
      benefitsServiceSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve(mockCoverageContentData)
      );
      fetchTileCoverageContentSpy.and.callThrough();
    });
    it('should set the value of tileCoverageContent and label of tabs', async () => {
      await component.fetchTileCoverageContent();
      expect(benefitsServiceSpy.getNoBenefitContents).toHaveBeenCalled();
      expect(component.tileCoverageContent).toEqual(
        JSON.parse(mockCoverageContentData.workplacedashboardTile)
      );
      expect(component.pageData.tabs).toEqual(JSON.parse(mockTabContent));
    });
  });

  it('onclick', () => {
    component.onclick('accounts');
    expect(component.selectedTab).toEqual('accounts');
  });

  describe('fetchTileCoverageContentOfMyBenefitUser', () => {
    let observable;
    let subscription;
    const mockMyBenefitTitleContent  ={
        "linkUrl": "https://my3.unit.voya.com/myBenefitsHub/home",
        "linkLabel": "Go to myBenefitsHub",
        "title": "Benefits & Coverages"
    };
    beforeEach(() => {
      
      fetchTileCoverageContentOfMyBenefitUserSpy.and.callThrough();
      observable = of(mockMyBenefitTitleContent);
      subscription = new Subscription();
      spyOn(component['subscription'], 'add');
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockMyBenefitTitleContent);
        return subscription;
      });
      benefitsServiceSpy.getMBHBenefitDetails.and.returnValue(observable);
    })
     
    it('should set the value of titleCovergeContent', async() =>{
        await component.fetchTileCoverageContentOfMyBenefitUser();
        expect(benefitsServiceSpy.getMBHBenefitDetails).toHaveBeenCalled();
        expect(component.tileCoverageContent).toEqual(
          mockMyBenefitTitleContent
        )
        expect(component['subscription'].add).toHaveBeenCalledWith(
          subscription
        );
      })
    
  })
});
