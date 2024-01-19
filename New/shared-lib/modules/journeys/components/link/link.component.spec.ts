import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '../../../../services/journey/journey.service';
import {LinkComponent} from './link.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;
  let journeyServiceSpy;
  let routerSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
        'setJourneyBackButton',
        'setAddAccount',
        'closeModal',
        'openMxAccModal',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      utilityServiceSpy.getIsWeb.and.returnValue(true);

      TestBed.configureTestingModule({
        declarations: [LinkComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LinkComponent);
      component = fixture.componentInstance;
      component.element = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isWeb', () => {
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toBeTrue();
    });
  });

  describe('linkClicked', () => {
    beforeEach(() => {
      journeyServiceSpy.getCurrentJourney.and.returnValue({
        journeyID: 1,
      });
    });
    it('should call navigateByUrl', () => {
      component.linkClicked('settings/notification-settings');
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'settings/notification-settings'
      );
    });
    it('should get the current journey from the service', () => {
      component.linkClicked('settings/notification-settings');
      expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
      expect(journeyServiceSpy.setJourneyBackButton).toHaveBeenCalledWith(
        '/journeys/journey/1/overview'
      );
    });
    it('should not set setJourneyBackButton in the local storage if link is not "settings/notification-settings"', () => {
      component.linkClicked('settings');
      expect(journeyServiceSpy.setJourneyBackButton).not.toHaveBeenCalled();
    });
    it('should navigate with query param if link is /account/add-accounts', () => {
      component.linkClicked('/account/add-accounts');
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/account/add-accounts'],
        {queryParams: {backRoute: 'journeys/journey/1/overview'}}
      );
    });
    it('should call openMxAccModal if link is /accounts/add-accounts', () => {
      component.linkClicked('/accounts/add-accounts');
      expect(journeyServiceSpy.openMxAccModal).toHaveBeenCalled();
    });
    it('should setAddAccount to true if link is /account/add-accounts ', () => {
      component.linkClicked('/account/add-accounts');
      expect(journeyServiceSpy.setAddAccount).toHaveBeenCalledWith('true');
    });
    it('should not setAddAccount if link is not /account/add-accounts ', () => {
      component.linkClicked('/account/add-accounts2');
      expect(journeyServiceSpy.setAddAccount).not.toHaveBeenCalled();
    });
    it('should close the modal if the link is closeModal', () => {
      component.linkClicked('closeModal');
      expect(journeyServiceSpy.closeModal).toHaveBeenCalled();
    });
  });
});
