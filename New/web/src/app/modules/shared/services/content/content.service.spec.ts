import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ContentService} from './content.service';
import {endPoints} from './constants/endpoints';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {of, Subscription} from 'rxjs';
import navbarContent from '@web/app/modules/shared/components/header/components/myvoyage-header/constants/content.json';
import {AccessService} from '@shared-lib/services/access/access.service';
import {CatchUpMessageHub} from './model/catchup.model';
import {LandingOrangeMoneyContent} from './model/landing-om-content.model';

describe('ContentService', () => {
  let utilityServiceSpy;
  let service: ContentService;
  let baseServiceSpy;
  let accessServiceSpy;

  const corouselDataMockup =
    '{ "items" :[{ "sectionHeader": "Manage Your Financial Wellbeing", "image": "https://cdn1-originals.webdamdb.com/13947_149809383?cache=1684505128&response-content-disposition=inline;filename=Pre_Assessment_enus.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTQ5ODA5MzgzP2NhY2hlPTE2ODQ1MDUxMjgmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9UHJlX0Fzc2Vzc21lbnRfZW51cy5zdmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjIxNDc0MTQ0MDB9fX1dfQ__&Signature=PMc3Bv1izpEP8-QGULy0XJMStt4je08YY9ghz1wgo8IaBCvEn222vBj2tIEwgdkaC6FYwi~bAY0n5j3A8EooflVccnMHuw2rNfmtWKjHc5CrZ6l51XytmDUzdwUT8Oxdym-hXECiiZoE1IjBQ2GZcBnuhj9bNcCr50fVBYOQgvSc7klE8CAiGmmTWY39inBIll3S8kVVREqRmbkkiO7zUyK7z2nb2xH1wAGx1Z3u5UgfSSgXMfhv-NRZUpJjeAY0zznz5mv37nUEpgIHpP1mcXbYAEfR7UizpMoT-13MbXqcIkRbGULQv3gYqIwc10LpFgXJ1Mnt2q~qZLEqWkNQYw__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","bodyTitle": "Take the Financial Wellbeing Assessment","bodyText": "Answer some simple questions to get a personalized dashboard with steps to help you grow your financial situation.","buttonLabel": "Get Started","url": "URL"},{"sectionHeader": "Update Your Information","image": "https://cdn1-originals.webdamdb.com/13947_149809166?cache=1684505023&response-content-disposition=inline;filename=Post_Assessment.svg&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cCo6Ly9jZG4xLW9yaWdpbmFscy53ZWJkYW1kYi5jb20vMTM5NDdfMTQ5ODA5MTY2P2NhY2hlPTE2ODQ1MDUwMjMmcmVzcG9uc2UtY29udGVudC1kaXNwb3NpdGlvbj1pbmxpbmU7ZmlsZW5hbWU9UG9zdF9Bc3Nlc3NtZW50LnN2ZyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MjE0NzQxNDQwMH19fV19&Signature=aebcraRjKRCV9HpYg~x7475e6o~UPO4rrLdSUIRLVTqXdSQF5owWtGf0mq~cZuWWpgbfHme1NBkYimKIn8J8OKA6h7~L~RmX~EWaFi9Tc~4a3xI1xSZDvGj02IWwF-ugFnXCupA8p2fw6Lr6bt0qIi5CL6dUyYZYFd8ElSkOZmXKed6l-MHZ-dCjcwtBxN52AvNbwDGogs24oxPcMGcO8rCbjEHxIbVSuMueyy5d5QDm5lyBgF8iD7teJXtSRHRJsZLmUvJ5eUlTvgIyaP~dmOzJZIwRRXhWjT7Ahko1Gos77uNfzzO4sWUv2yoUR32UyOYA9c187VK0ATuuBZMIgA__&Key-Pair-Id=APKAI2ASI2IOLRFF2RHA","bodyTitle": "Stay on top of your Financial Wellbeing","bodyText": "Keeping your information up to date will make sure you are receiving the best recommendations to help you grow your Financial Wellbeing.","buttonLabel": "Update your assessment","url": "URL"},{"sectionHeader": "Adding Accounts","image": "assets/icon/account-type/add-account-header.svg","bodyTitle": "Did you know that you can add your accounts to your dashboard?","bodyText": "Your money might be better, when it’s together. Add in all of your financial accounts to quickly see how much you have, and how small steps can get you closer to your goals.","buttonLabel": "Add Account","url": "URL"},{"sectionHeader": "Your Financial Strength Score","image": "assets/icon/account-type/add-account-header.svg","bodyTitle": "Status: Building","bodyText": "People who are still building toward stability may have trouble dealing with surprise expenses and may miss bill payments regularly.","ctaLabel": "View Complete Financial summary","url": "URL"}]}';

  const resultLeftSideMockData = {
    SuggestedLifeEventHeader:
      '{"journeyHeader":"Suggested Life Event","journeyInProgressButton":"Continue"}',
    WorkplaceAccountSnapshotHeader: 'WorkplaceAccountSnapshotHeader',
  };

  const catchupMockData = {
    workplacecatchup:
      '{"catchupHeader":"Let’s Catch Up","catchupViewallButton":"View All","catchupReadmoreButton":"Read more"}',
  };

  const orangeMoneyContentMockData = {
    OMTileIncompleteMadlib: 'incomplete Madlib text',
  };

  const catchupMessageHubMockData =
    '{"catchUp":[{"eventName":"Account Aggregated","Category_name":"catchUp","Title":"Add a Beneficiary","Description":"Our records indicate that you have no beneficiary designated in your account.","Link_name":"Add a Beneficiary now","Link_url":"","eventStartDt":"2022-07-21T16: 02: 09","eventEndDt":"2022-07-21T17: 32: 07","eventAge":"12 days ago"},{"eventName":"Journey Not Completed","Category_name":"catchUp","Title":"Enrollment season","Description":"It\u2019s open enrollment season! Make sure you select your benefits by the end of next week","Link_name":"","Link_url":"","eventStartDt":"2022-07-06T09: 45: 30","eventEndDt":"2022-07-06T10: 03: 38","eventAge":"27 days ago"},{"eventName":"Journey Not Completed","Category_name":"catchUp","Title":"Stay smart while online","Description":" The idea of needing to be mindful of your financial cybersecurity isn\u2019t new - but","Link_name":"","Link_url":"","eventStartDt":"2022-07-05T16: 16: 54","eventEndDt":"2022-07-05T16: 45: 01","eventAge":"28 days ago"}],"highPriority":[{"eventName":"Account Aggregated","Category_name":"highPriority","Title":"Add your external account","Description":"Add in your outside accounts to power up myVoyage and get more insight into your finances.","Link_name":"","Link_url":"","eventStartDt":"2022-07-21T16: 02: 09","eventEndDt":"2022-07-21T17: 32: 07","eventAge":"12 days ago"}],"recent":[{"eventName":"Account Aggregated","Category_name":"Recent","Title":"Add your external account","Description":"Add in your outside accounts to power up myVoyage and get more insight into your finances.","Link_name":"","Link_url":"","eventStartDt":"2022-07-21T16: 02: 09","eventEndDt":"2022-07-21T17: 32: 07","eventAge":"12 days ago"}]}';
  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
        'appendBaseUrlToEndpoints',
      ]);
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkWorkplaceAccess',
        'getSessionId',
      ]);

      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        providers: [
          ContentService,
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      });
      service = TestBed.inject(ContentService);
      service['subscription'] = jasmine.createSpyObj('Subscription', [
        'add',
        'unsubscribe',
      ]);
      service.endPoints = endPoints;
      service.navbarContent = navbarContent;
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getLandingAddAccountCarousels', () => {
    beforeEach(
      waitForAsync(() => {
        service['getCarouselData'] = jasmine
          .createSpy()
          .and.returnValue(Promise.resolve(JSON.parse(corouselDataMockup)));
      })
    );
    it('should call get method to get the data if landingAddAccountCarouselData is undefined', done => {
      service['landingAddAccountCarouselData'] = undefined;
      service.getLandingAddAccountCarousels().subscribe(data => {
        expect(service['getCarouselData']).toHaveBeenCalled();
        expect(data).toEqual({
          ...JSON.parse(corouselDataMockup),
        });
        done();
      });
    });

    it('should not call get to get the data if landingAddAccountCarouselData is defined and refresh is false', () => {
      service['landingAddAccountCarouselData'] = of({
        ...JSON.parse(corouselDataMockup),
      });
      const landingAddAccountCarouselDataSpy = jasmine.createSpyObj(
        'landingAddAccountCarouselDataSpy',
        ['']
      );
      service[
        'landingAddAccountCarouselSubject'
      ] = landingAddAccountCarouselDataSpy;
      const result = service.getLandingAddAccountCarousels();
      expect(service['getCarouselData']).not.toHaveBeenCalled();
      expect(result).toEqual(landingAddAccountCarouselDataSpy);
    });

    describe('if landingAddAccountCarouselData is defined but refresh is true', () => {
      let observable;
      let subscription;
      beforeEach(
        waitForAsync(() => {
          service['getCarouselData'] = jasmine
            .createSpy()
            .and.returnValue(Promise.resolve(JSON.parse(corouselDataMockup)));
          observable = of(JSON.parse(corouselDataMockup));
          subscription = new Subscription();
          spyOn(observable, 'subscribe').and.callFake(f => {
            f(JSON.parse(corouselDataMockup));
            return subscription;
          });
        })
      );
      it('should call get to get the data ', done => {
        service['landingAddAccountCarouselData'] = observable;
        service.getLandingAddAccountCarousels(true).subscribe(data => {
          expect(service['getCarouselData']).toHaveBeenCalled();
          expect(data).toEqual({
            ...JSON.parse(corouselDataMockup),
          });
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('getCarouselData', () => {
    beforeEach(() => {
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(JSON.parse(corouselDataMockup))
      );
    });
    it('should get Carousel data with Session Id ', async () => {
      const result = await service['getCarouselData']();
      expect(accessServiceSpy.getSessionId).toHaveBeenCalled();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/dashboard/carousels?sessionId=Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      expect(result).toEqual(JSON.parse(corouselDataMockup));
    });
  });

  describe('getLeftSideContent', () => {
    beforeEach(() => {
      spyOn(service, 'manageLeftSideContentData').and.returnValue({
        ...JSON.parse(resultLeftSideMockData.SuggestedLifeEventHeader),
        workplaceAccountSnapshotHeader: 'WorkplaceAccountSnapshotHeader',
      });
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(resultLeftSideMockData)
      );
    });

    it('should call get to get the data if leftHandSideConentData is undefined', done => {
      service['leftHandSideConentData'] = undefined;
      service.getLeftSideContent().subscribe(data => {
        expect(baseServiceSpy.get).toHaveBeenCalled();
        expect(service.manageLeftSideContentData).toHaveBeenCalledWith(
          resultLeftSideMockData
        );
        expect(data).toEqual({
          ...JSON.parse(resultLeftSideMockData.SuggestedLifeEventHeader),
          workplaceAccountSnapshotHeader: 'WorkplaceAccountSnapshotHeader',
        });
        done();
      });
    });

    it('should not call get to get the data if leftHandSideConentData is defined and refresh is false', () => {
      service['leftHandSideConentData'] = of({
        ...JSON.parse(resultLeftSideMockData.SuggestedLifeEventHeader),
      });
      const leftHandSideConentSubjectSpy = jasmine.createSpyObj(
        'leftHandSideConentSubjectSpy',
        ['']
      );
      service['leftHandSideConentSubject'] = leftHandSideConentSubjectSpy;
      const result = service.getLeftSideContent();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(service.manageLeftSideContentData).not.toHaveBeenCalled();
      expect(result).toEqual(leftHandSideConentSubjectSpy);
    });

    describe('if refresh will be true', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        subscription = new Subscription();
        observable = of(resultLeftSideMockData);
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(resultLeftSideMockData);
          return subscription;
        });
      });
      it('should call get to get the data', done => {
        service['leftHandSideConentData'] = observable;
        service.getLeftSideContent(true).subscribe(data => {
          expect(baseServiceSpy.get).toHaveBeenCalled();
          expect(data).toEqual({
            ...JSON.parse(resultLeftSideMockData.SuggestedLifeEventHeader),
            workplaceAccountSnapshotHeader: 'WorkplaceAccountSnapshotHeader',
          });
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('manageLeftSideContentData', () => {
    it('should return the JOSN parsed content', () => {
      const result = service.manageLeftSideContentData(resultLeftSideMockData);
      expect(result).toEqual({
        suggestedLifeEventHeader: {
          journeyHeader: 'Suggested Life Event',
          journeyInProgressButton: 'Continue',
        },
        workplaceAccountSnapshotHeader: 'WorkplaceAccountSnapshotHeader',
      });
    });
    it('should return the null', () => {
      const resultLeftSideMockNull = {
        SuggestedLifeEventHeader: null,
        WorkplaceAccountSnapshotHeader: '',
      };
      const result = service.manageLeftSideContentData(resultLeftSideMockNull);
      expect(result).toEqual({});
    });
  });

  describe('getCatchupContent', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(catchupMockData));
    });

    it('should call get to get the data if catchupConentData is undefined', done => {
      service['catchupConentData'] = undefined;
      service.getCatchupContent().subscribe(data => {
        expect(baseServiceSpy.get).toHaveBeenCalled();
        expect(data).toEqual({
          ...JSON.parse(catchupMockData.workplacecatchup),
        });
        done();
      });
    });

    describe('if refresh be true', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        subscription = new Subscription();
        observable = of({
          ...JSON.parse(catchupMockData.workplacecatchup),
        });
        spyOn(observable, 'subscribe').and.callFake(f => {
          f({
            ...JSON.parse(catchupMockData.workplacecatchup),
          });
          return subscription;
        });
      });

      it('should call get to get the data', done => {
        service['catchupConentData'] = observable;
        service.getCatchupContent(true).subscribe(data => {
          expect(baseServiceSpy.get).toHaveBeenCalled();
          expect(data).toEqual({
            ...JSON.parse(catchupMockData.workplacecatchup),
          });
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should not call get to get the data if catchupConentData is defined and refresh is false', () => {
      service['catchupConentData'] = of({
        ...JSON.parse(catchupMockData.workplacecatchup),
      });
      const catchupConentSubjectSpy = jasmine.createSpyObj(
        'catchupConentSubjectSpy',
        ['']
      );
      service['catchupConentSubject'] = catchupConentSubjectSpy;
      const result = service.getCatchupContent();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(catchupConentSubjectSpy);
    });
  });

  describe('getCatchUpMessageHub', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(JSON.parse(catchupMessageHubMockData))
      );
    });

    it('should call get to get the data if catchUpMessageHubData is undefined', done => {
      service['catchUpMessageHubData'] = undefined;
      service.getCatchUpMessageHub().subscribe((data: CatchUpMessageHub) => {
        expect(baseServiceSpy.get).toHaveBeenCalled();
        expect(data).toEqual(JSON.parse(catchupMessageHubMockData));
        done();
      });
    });

    describe('if refresh be true', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        subscription = new Subscription();
        observable = of(JSON.parse(catchupMessageHubMockData));
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(JSON.parse(catchupMessageHubMockData));
          return subscription;
        });
      });

      it('should call get to get the data', done => {
        service['catchUpMessageHubData'] = observable;
        service.getCatchUpMessageHub(true).subscribe(data => {
          expect(baseServiceSpy.get).toHaveBeenCalled();
          expect(data).toEqual(JSON.parse(catchupMessageHubMockData));
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should not call get to get the data if catchUpMessageHubData is defined and refresh is false', () => {
      service['catchUpMessageHubData'] = of(
        JSON.parse(catchupMessageHubMockData)
      );
      const catchUpMessageHubSubjectSpy = jasmine.createSpyObj(
        'catchUpMessageHubSubjectSpy',
        ['']
      );
      service['catchUpMessageHubSubject'] = catchUpMessageHubSubjectSpy;
      const result = service.getCatchUpMessageHub();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(catchUpMessageHubSubjectSpy);
    });
  });

  describe('getOrangeMoneyContent', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(orangeMoneyContentMockData)
      );
    });

    it('should call get to get the data if landingOrangeMoneyContentData is undefined', done => {
      service['landingOrangeMoneyContentData'] = undefined;
      service
        .getOrangeMoneyContent()
        .subscribe((data: LandingOrangeMoneyContent) => {
          expect(baseServiceSpy.get).toHaveBeenCalled();
          expect(data).toEqual(orangeMoneyContentMockData);
          done();
        });
    });

    describe('if refresh be true', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        subscription = new Subscription();
        observable = of(orangeMoneyContentMockData);
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(orangeMoneyContentMockData);
          return subscription;
        });
      });

      it('should call get to get the landingOrangeMoneyContentData', done => {
        service['landingOrangeMoneyContentData'] = observable;
        service.getOrangeMoneyContent(true).subscribe(data => {
          expect(baseServiceSpy.get).toHaveBeenCalled();
          expect(data).toEqual(orangeMoneyContentMockData);
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should not call get to get the data if landingOrangeMoneyContentData is defined and refresh is false', () => {
      service['landingOrangeMoneyContentData'] = of(orangeMoneyContentMockData);
      const landingOrangeMoneyContentSubjectSpy = jasmine.createSpyObj(
        'landingOrangeMoneyContentSubjectSpy',
        ['']
      );
      service[
        'landingOrangeMoneyContentSubject'
      ] = landingOrangeMoneyContentSubjectSpy;
      const result = service.getOrangeMoneyContent();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(landingOrangeMoneyContentSubjectSpy);
    });
  });

  describe('getMbhDashboardContent', () => {
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(
        Promise.resolve({
          billingandpayments: 'billingandpayments',
        })
      );
    });

    it('should call get to get the data if mbhDashboardConentData is undefined', done => {
      service['mbhDashboardConentData'] = undefined;
      service.getMbhDashboardContent().subscribe(data => {
        expect(baseServiceSpy.get).toHaveBeenCalled();
        expect(data).toEqual({
          billingandpayments: 'billingandpayments',
        });
        done();
      });
    });

    it('should not call get to get the data if mbhDashboardConentData is defined and refresh is false', () => {
      service['mbhDashboardConentData'] = of({
        billingandpayments: 'billingandpayments',
      });
      const mbhDashboardConentSubjectSpy = jasmine.createSpyObj(
        'mbhDashboardConentSubjectSpy',
        ['']
      );
      service['mbhDashboardConentSubject'] = mbhDashboardConentSubjectSpy;
      const result = service.getMbhDashboardContent();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(mbhDashboardConentSubjectSpy);
    });

    describe('if refresh will be true', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        subscription = new Subscription();
        observable = of({
          billingandpayments: 'billingandpayments',
        });
        spyOn(observable, 'subscribe').and.callFake(f => {
          f({
            billingandpayments: 'billingandpayments',
          });
          return subscription;
        });
      });
      it('should call get to get the data', done => {
        service['mbhDashboardConentData'] = observable;
        service.getMbhDashboardContent(true).subscribe(data => {
          expect(baseServiceSpy.get).toHaveBeenCalled();
          expect(data).toEqual({
            billingandpayments: 'billingandpayments',
          });
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      service.ngOnDestroy();
      expect(service['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
