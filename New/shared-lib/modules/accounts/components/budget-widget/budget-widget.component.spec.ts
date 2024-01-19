import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BudgetWidgetComponent} from './budget-widget.component';
import {Component, Input} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('BudgetWidgetComponent', () => {
  let component: BudgetWidgetComponent;
  let fixture: ComponentFixture<BudgetWidgetComponent>;
  let utilityServiceSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      routerSpy = jasmine.createSpyObj('routerSpy', ['navigate']);
      TestBed.configureTestingModule({
        declarations: [BudgetWidgetComponent, MockMXWidgetComponent],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BudgetWidgetComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleClick', () => {
    it('When getIsWeb return true', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.handleClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith([
        '/accounts/budget-widget',
      ]);
    });
    it('When getIsWeb return false', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.handleClick();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/budget-widget']);
    });
  });
});
