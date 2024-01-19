import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MxWidgetComponent} from './mx-widget.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('MxWidgetComponent', () => {
  let component: MxWidgetComponent;
  let fixture: ComponentFixture<MxWidgetComponent>;
  let routerSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);

      TestBed.configureTestingModule({
        declarations: [MxWidgetComponent, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MxWidgetComponent);
      component = fixture.componentInstance;
      component.element = {
        widgetType: WidgetType.PULSE_CAROUSEL_MINI,
        idSuffix: 'idSuffix',
        link: '/account/insights',
        weblink: '/account/all-accounts/insights',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('viewMoreClicked', () => {
    it('should route to element webLink if isWeb', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);

      component.viewMoreClicked();

      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/account/all-accounts/insights'
      );
    });

    it('should route to insights', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);

      component.viewMoreClicked();

      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/account/insights');
    });
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      jasmine.clock().install();
      const today = new Date('2022-09-25');
      jasmine.clock().mockDate(today);
    });
    it('should assign current timestamp number to randomStr', () => {
      component.ngOnInit();
      expect(component.randomStr).toEqual('1664064000000');
    });
    afterEach(function() {
      jasmine.clock().uninstall();
    });
  });
});
