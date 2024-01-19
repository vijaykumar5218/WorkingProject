import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ResourcesComponent} from './resources.component';

@Component({
  selector: 'journeys-resources-list',
  template: '',
})
class MockResourcesList {
  @Input() resource;
}

describe('ResourcesComponent', () => {
  let component: ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;
  let resources;
  let footerTypeServiceSpy;
  let journeyServiceSpy;
  let sharedUtilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      resources = [
        {
          header: 'resource',
          isExpanded: false,
          type: 'webview',
          links: [],
        },
        {
          header: 'resource',
          isExpanded: true,
          type: 'webview',
          links: [],
        },
      ];
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
        'publishSelectedTab',
      ]);
      journeyServiceSpy.getCurrentJourney.and.returnValue({
        parsedResourcesContent: resources,
      });
      TestBed.configureTestingModule({
        declarations: [ResourcesComponent, MockResourcesList],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ResourcesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.resources = {resources: resources};
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    component.isWeb = false;
    sharedUtilityServiceSpy.getIsWeb.and.returnValue(true);
    component.ngOnInit();
    expect(sharedUtilityServiceSpy.getIsWeb).toHaveBeenCalled();
    expect(component.isWeb).toEqual(true);
  });

  describe('ionViewWillEnter', () => {
    it('should publish the footer type when isWeb would be true', () => {
      component.isWeb = true;
      component.ionViewWillEnter();
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: FooterType.tabsnav,
        selectedTab: 'journeys-list',
      });
    });

    it('should publish the footer type when isWeb would be false', () => {
      component.isWeb = false;
      component.ionViewWillEnter();
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: FooterType.tabsnav,
        selectedTab: 'journeys',
      });
    });

    it('should publish the selectedTab', () => {
      component.ionViewWillEnter();
      expect(journeyServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'resources'
      );
    });

    it('should get the resource content from the journeyservice', () => {
      component.ionViewWillEnter();
      expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
      expect(component.resources).toEqual(resources);
    });
  });

  describe('toggleExpand', () => {
    it('should flip the isExpanded flag on the resource', () => {
      const resource = {
        header: 'resource',
        isExpanded: false,
        type: 'webview',
        links: [],
      };
      component.toggleExpand(resource);
      expect(resource.isExpanded).toBeTrue();
    });

    it('should set expandAll to true if there is at least one collapsed resource', () => {
      resources[1].isExpanded = false;
      component.expandAll = false;
      component.toggleExpand(component.resources.resources[0]);
      expect(component.expandAll).toBeTrue();
    });

    it('should set expandAll to false if there are no collapsed resources', () => {
      component.expandAll = true;
      component.toggleExpand(component.resources.resources[0]);
      expect(component.expandAll).toBeFalse();
    });
  });

  describe('expandCollapseAll', () => {
    it('should set all resource isExpanded to expandAll', () => {
      component.expandAll = false;
      component.expandCollapseAll();
      expect(component.resources.resources.length).toEqual(2);
      expect(component.resources.resources[0].isExpanded).toBeFalse();
      expect(component.resources.resources[1].isExpanded).toBeFalse();
    });

    it('should flip expandAll', () => {
      component.expandAll = false;
      component.expandCollapseAll();
      expect(component.expandAll).toBeTrue();
    });
  });
});
