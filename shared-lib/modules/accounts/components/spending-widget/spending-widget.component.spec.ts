import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {SpendingWidgetComponent} from './spending-widget.component';
import {Component, Input} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';

@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('SpendingWidgetComponent', () => {
  let component: SpendingWidgetComponent;
  let fixture: ComponentFixture<SpendingWidgetComponent>;
  let mxServiceSpy;
  let fetchSpy;
  let subscriptionSpy;
  let utilityServiceSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      routerSpy = jasmine.createSpyObj('routerSpy', ['navigate']);
      mxServiceSpy = jasmine.createSpyObj('MXService', ['getHeaderData']);
      TestBed.configureTestingModule({
        declarations: [SpendingWidgetComponent, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: MXService, useValue: mxServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SpendingWidgetComponent);
      component = fixture.componentInstance;
      fetchSpy = spyOn(component, 'fetchScreenContent');

      subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component['mxBudgetSubscription'] = subscriptionSpy;

      fixture.detectChanges();
    })
  );

  describe('ngOnInit', () => {
    it('should call fetchScreenContent function', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.fetchScreenContent).toHaveBeenCalled();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
  });

  describe('fetchScreenContent', () => {
    let MX;
    beforeEach(() => {
      fetchSpy.and.callThrough();
      MX = [
        {
          spending_budget_description: [
            {
              bottom_text:
                'Let’s look at your current spending and this months budget.',
              image_url:
                'https://cdn2.webdamdb.com/220th_sm_wY2B7ECU3h41.jpg?1607047662',
              top_text: '',
            },
          ],
          spending_budget_title: '',
        },
      ];
      mxServiceSpy.getHeaderData.and.returnValue(of(MX));
    });

    it('should call getScreenMessage from MXService and return message', () => {
      component.getHeaderMessage = undefined;
      component.fetchScreenContent();
      expect(mxServiceSpy.getHeaderData).toHaveBeenCalled();
      expect(component.getHeaderMessage).toEqual(MX);
    });
  });

  describe('handleClick', () => {
    it('When isWeb would be true', () => {
      component.isWeb = true;
      component.handleClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith([
        '/accounts/spending-widget',
      ]);
    });
    it('When isWeb would be false', () => {
      component.isWeb = false;
      component.handleClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/spending-widget']);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
