import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {FooterTypeService} from '../footer/services/footer-type/footer-type.service';
import {JourneysComponent} from './journeys.component';
import {JourneyResponse} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({selector: 'journeys-list'})
class MockList {
  @Input() headerText;
  @Input() journeys;
}

describe('JourneysComponent', () => {
  let component: JourneysComponent;
  let fixture: ComponentFixture<JourneysComponent>;
  let headerFooterTypeServiceSpy;
  let journeyServiceSpy;
  let routerSpy;
  let journeyData: JourneyResponse;
  let sharedUtilityServiceSpy;
  let footerTypeServiceSpy;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      headerFooterTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publishType',
      ]);
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'fetchJourneys',
      ]);
      journeyData = {
        flags: {},
        all: [
          {
            journeyID: 1,
            journeyName: 'JourneyName',
            lastModifiedStepIndex: 0,
            landingAndOverviewContent: '',
            resourcesContent: '',
            parsedLandingAndOverviewContent: {
              intro: {
                header: 'Adding to your family',
                message:
                  'Having a kid changes everything. Learn how to get your finances in order when your family is growing.',
                imgUrl:
                  'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg',
              },
              overview: undefined,
            },
            steps: [],
          },
          {
            journeyID: 2,
            journeyName: 'JourneyName',
            lastModifiedStepIndex: 0,
            landingAndOverviewContent: '',
            resourcesContent: '',
            parsedLandingAndOverviewContent: {
              intro: {
                header: 'Adding to your family2',
                message:
                  'Having a kid changes everything. Learn how to get your finances in order when your family is growing. 2',
                imgUrl:
                  'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg2',
              },
              overview: undefined,
            },
            steps: [],
          },
        ],
        recommended: [],
      };
      journeyServiceSpy.fetchJourneys.and.returnValue(of(journeyData));
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);
      accessServiceSpy = jasmine.createSpyObj('accessServiceSpy', [
        'checkWorkplaceAccess',
      ]);
      accessServiceSpy.checkWorkplaceAccess.and.returnValue(
        Promise.resolve({myWorkplaceDashboardEnabled: true})
      );
      TestBed.configureTestingModule({
        declarations: [JourneysComponent, MockList],
        imports: [IonicModule.forRoot()],
        providers: [
          {
            provide: HeaderFooterTypeService,
            useValue: headerFooterTypeServiceSpy,
          },
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(JourneysComponent);
      component = fixture.componentInstance;
    })
  );

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it('should fetch the journeys', async () => {
      fixture.detectChanges();
      await component.ionViewWillEnter();
      expect(journeyServiceSpy.fetchJourneys).toHaveBeenCalled();
    });

    it('should publish header when isWeb would be false', async () => {
      component.isWeb = false;
      fixture.detectChanges();
      await component.ionViewWillEnter();
      expect(headerFooterTypeServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: {
            headername: 'Life Events',
            btnright: true,
            buttonRight: {
              name: '',
              link: 'notification',
            },
          },
        },
        {type: FooterType.tabsnav, selectedTab: 'journeys'}
      );
    });

    it('should publish footer when isWeb would be true', async () => {
      component.isWeb = true;
      fixture.detectChanges();
      await component.ionViewWillEnter();
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: FooterType.tabsnav,
        selectedTab: 'journeys-list',
      });
    });
  });

  describe('ionViewWillLeave', () => {
    it('should set journeys$ to undefined', () => {
      component.journeys$ = of(journeyData);
      component.ionViewWillLeave();
      expect(component.journeys$).toBeUndefined();
    });
  });

  describe('template', () => {
    describe('intro', () => {
      beforeEach(async () => {
        await component.ionViewWillEnter();
        fixture.detectChanges();
      });

      it('should display desc', () => {
        const desc = fixture.debugElement.query(By.css('.bullet'));
        expect(desc).toBeTruthy();
        expect(
          desc.nativeNode.firstElementChild.childNodes[0].innerHTML
        ).toEqual('actionable and personalized steps');
        expect(
          desc.nativeNode.lastElementChild.childNodes[0].innerHTML
        ).toEqual(
          'tools and resources that help improve your health and financial wellbeing'
        );
      });

      it('should display img', () => {
        const img = fixture.debugElement.query(By.css('.image'));
        expect(img).toBeTruthy();
        expect(img.attributes.src).toEqual(
          'assets/icon/journeys/wandering_in_nature.svg'
        );
      });
    });

    it('should not display any journeys-lists if journeys is undefined', async () => {
      journeyServiceSpy.fetchJourneys.and.returnValue(of(undefined));
      await component.ionViewWillEnter();
      fixture.detectChanges();
      expect(
        fixture.debugElement.queryAll(By.css('journeys-list')).length
      ).toEqual(0);
    });

    it('should display both journeys-lists if all and recommended have journeys', async () => {
      journeyData.recommended = journeyData.all;
      await component.ionViewWillEnter();
      fixture.detectChanges();
      expect(
        fixture.debugElement.queryAll(By.css('journeys-list')).length
      ).toEqual(2);
    });

    describe('all journeys', () => {
      it('should not display if all journeys is empty', () => {
        component.journeys$ = of({flags: {}, all: [], recommended: []});
        fixture.detectChanges();
        expect(
          fixture.debugElement.queryAll(By.css('journeys-list')).length
        ).toEqual(0);
      });

      it('should display if there are journeys in all', () => {
        component.journeys$ = of({
          flags: {},
          all: journeyData.all,
          recommended: [],
        });
        fixture.detectChanges();
        expect(
          fixture.debugElement.queryAll(By.css('journeys-list')).length
        ).toEqual(1);
      });
    });

    describe('recommended journeys', () => {
      it('should not display if recommended journeys is empty', () => {
        component.journeys$ = of({flags: {}, all: [], recommended: []});
        fixture.detectChanges();
        expect(
          fixture.debugElement.queryAll(By.css('journeys-list')).length
        ).toEqual(0);
      });

      it('should display if there are journeys in recommended', () => {
        component.journeys$ = of({
          flags: {},
          all: [],
          recommended: journeyData.all,
        });
        fixture.detectChanges();
        expect(
          fixture.debugElement.queryAll(By.css('journeys-list')).length
        ).toEqual(1);
      });
    });
  });
});
