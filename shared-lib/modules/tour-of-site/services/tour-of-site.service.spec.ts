import {TestBed} from '@angular/core/testing';
import {TourOfSiteService} from './tour-of-site.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedUtilityService} from '../../../services/utility/utility.service';
import {BaseService} from '../../../services/base/base-factory-provider';
import {AccessService} from '../../../services/access/access.service';
import {endPoints} from '../constants/endpoints';
import {TourOfSiteResponse} from '../models/tour-of-site-content.model';
import {of} from 'rxjs';

describe('TourOfSiteService', () => {
  let service: TourOfSiteService;
  let utilityServiceSpy;
  let baseServiceSpy;
  let accessServiceSpy;

  const tourOfSiteResponseMock = JSON.parse(
    '{"tourContent":{"desktop":[{"id":"NAVIGATION","selector":"voya-global-nav","subContent":[{"id":"PRIMARY_NAVIGATION","selectorSource":"shadowRoot","selector":"v-primary-navigation","subContent":[{"id":"PRIMARY_NAVIGATION_WRAPPER","intro":"Navigate your site, quickly access key features, and view or change preferences.","gaLabel":"","selectorSource":"shadowRoot","selector":".v-primary-menu-holder"},{"id":"PERSONAL_INFO","intro":"View or change account and security preferences as well as access important messages and notices.","gaLabel":"","selectorSource":"shadowRoot","selector":".profileIcon"}]}]},{"id":"ACCOUNT_SNAPSHOTS","intro":"Stay up to date and view important account information or action items specific to different life events.","gaLabel":"","selector":".greeting"},{"id":"HERO_CARDS","intro":"View and track progress on your path to financial wellness along with guidance on your next best step.","gaLabel":"","selector":"#heroCarousel"},{"id":"ACCOUNT_COVERAGES","intro":"Get a historical view of your accounts and access all of them in one place.","gaLabel":"","selector":".accounts-coverages"}],"mobile":[]}}'
  ) as TourOfSiteResponse;

  beforeEach(() => {
    utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy ', [
      'appendBaseUrlToEndpoints',
    ]);
    baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
    accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
      'getSessionId',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        TourOfSiteService,
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
        {provide: BaseService, useValue: baseServiceSpy},
        {provide: AccessService, useValue: accessServiceSpy},
      ],
    });

    service = TestBed.inject(TourOfSiteService);
    service.endPoints = endPoints;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTourOfSite', () => {
    beforeEach(() => {
      accessServiceSpy.getSessionId.and.returnValue(
        Promise.resolve('Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397')
      );
      baseServiceSpy.get.and.returnValue(
        Promise.resolve(tourOfSiteResponseMock)
      );
    });

    it('should get Carousel data with Session Id ', async () => {
      const result = await service.getTourOfSite();
      expect(accessServiceSpy.getSessionId).toHaveBeenCalled();
      expect(baseServiceSpy.get).toHaveBeenCalledWith(
        'myvoyage/ws/ers/dashboard/tourOfSite?sessionId=Ar0wSx5Vu5tu2WBBICQ1oCu1.i9397'
      );
      expect(result).toEqual(tourOfSiteResponseMock);
    });
  });

  describe('getTourOfSiteData', () => {
    beforeEach(() => {
      service['getTourOfSite'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(tourOfSiteResponseMock));
    });

    it('should call get method, tourOfSiteResponse undefined', done => {
      service['tourOfSiteResponse'] = undefined;
      service.getTourOfSiteData().subscribe(data => {
        expect(service['getTourOfSite']).toHaveBeenCalled();
        expect(data).toEqual(tourOfSiteResponseMock);
        done();
      });
    });

    it('should NOT call get method, tourOfSiteResponse has value', () => {
      const mockData = of({tourContent: {desktop: [], mobile: []}});
      service['tourOfSiteResponse'] = mockData;
      const result = service.getTourOfSiteData();
      expect(service['getTourOfSite']).not.toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });
});
