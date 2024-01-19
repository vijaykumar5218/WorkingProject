import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {Journey} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyComponent} from './journey.component';

describe('JourneyComponent', () => {
  let component: JourneyComponent;
  let fixture: ComponentFixture<JourneyComponent>;
  let journeyServiceSpy;
  let journey: Journey;
  let headerTypeServiceSpy;
  let propagateToActiveTabSpy;

  const tabs = [
    {label: 'Overview', link: 'overview'},
    {label: 'Steps', link: 'steps'},
    {label: 'Resources', link: 'resources'},
  ];

  beforeEach(
    waitForAsync(() => {
      journey = {
        journeyID: 1,
        journeyName: 'journeyName',
        lastModifiedStepIndex: 0,
        landingAndOverviewContent: '',
        resourcesContent: '',
        parsedLandingAndOverviewContent: {
          intro: {
            header: 'Adding to your family',
            message:
              'Having a kid changes everything. Learn how to get your finances in order when your family is growing.',
            imgUrl: 'assets/icon/journeys/all/Master_Close_Ups_Family_2.svg',
          },
          overview: undefined,
        },
        steps: [],
      };
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
        'getSelectedTab$',
        'fetchTabs',
        'publishLeaveJourney',
      ]);
      journeyServiceSpy.getCurrentJourney.and.returnValue(journey);
      journeyServiceSpy.getSelectedTab$.and.returnValue(of('overview'));
      journeyServiceSpy.fetchTabs.and.returnValue(tabs);
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      TestBed.configureTestingModule({
        declarations: [JourneyComponent],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {
            provide: HeaderTypeService,
            useValue: headerTypeServiceSpy,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(JourneyComponent);
      component = fixture.componentInstance;
      propagateToActiveTabSpy = spyOn<any>(component, 'propagateToActiveTab');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the tabs', () => {
      expect(journeyServiceSpy.fetchTabs).toHaveBeenCalledWith([
        'overview',
        'steps',
        'resources',
      ]);
      expect(component.tabs).toEqual(tabs);
    });

    it('should subscribe to selected tab', () => {
      expect(journeyServiceSpy.getSelectedTab$).toHaveBeenCalled();
      expect(component.selectedTab).toEqual('overview');
    });
  });

  describe('ionViewWillEnter', () => {
    it('should get the journey from the service', () => {
      component.ionViewWillEnter();
      expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
    });

    it('should set the header type', () => {
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: {
          headername: journey.parsedLandingAndOverviewContent.intro.header,
          btnright: true,
          buttonRight: {
            name: '',
            link: 'notification',
          },
          btnleft: true,
          buttonLeft: {
            name: '',
            link: 'journeys',
          },
        },
      });
    });

    it('should propagate the ionViewWillEnter to the selected tab', () => {
      component.ionViewWillEnter();
      expect(propagateToActiveTabSpy).toHaveBeenCalledWith('ionViewWillEnter');
    });
  });

  describe('handleClick', () => {
    it('should update the selected tab to the tab that was clicked using link if it is there', () => {
      const selectedTabLink = 'selectedTab';
      component.selectedTab = undefined;
      component.handleClick(selectedTabLink);
      expect(component.selectedTab).toEqual(selectedTabLink);
    });
  });

  describe('ionViewWilLeave', () => {
    it('should propagate the ionViewWillLeave to the selected tab', () => {
      component.ionViewWillLeave();
      expect(propagateToActiveTabSpy).toHaveBeenCalledWith('ionViewWillLeave');
    });

    it('should publish leaveJourney', () => {
      component.ionViewWillLeave();
      expect(journeyServiceSpy.publishLeaveJourney).toHaveBeenCalled();
    });
  });

  describe('tabChange', () => {
    it('should set the active tab', () => {
      component['activeTab'] = undefined;
      const activeTab = jasmine.createSpyObj('activeTab', ['']);
      const tabsRef = {
        outlet: {
          activatedView: {
            element: activeTab,
          },
        },
      };
      component.tabChange(tabsRef as any);
      expect(component['activeTab']).toEqual(activeTab);
    });
  });

  describe('ionViewDidEnter', () => {
    it('should propagate the ionViewDidEnter to the selected tab', () => {
      component.ionViewDidEnter();
      expect(propagateToActiveTabSpy).toHaveBeenCalledWith('ionViewDidEnter');
    });
  });

  describe('propagateToActiveTab', () => {
    beforeEach(() => {
      propagateToActiveTabSpy.and.callThrough();
    });

    it('should dispatch the event to the active tab if there is one', () => {
      const activeTab = jasmine.createSpyObj('activeTab', ['dispatchEvent']);
      component['activeTab'] = activeTab;
      component['propagateToActiveTab']('ionViewWillLeave');
      expect(component['activeTab'].dispatchEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: 'ionViewWillLeave',
        })
      );
    });

    it('should not error if there is no activeTab', () => {
      component['activeTab'] = undefined;
      expect(component['propagateToActiveTab'].bind('test')).not.toThrow();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from selectedTabSubscription', () => {
      const unsubscribeSpy = spyOn(
        component['selectedTabSubscription'],
        'unsubscribe'
      );
      component.ngOnDestroy();
      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
