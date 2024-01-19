import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AccountService} from '@shared-lib/services/account/account.service';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {InsightsComponent} from './insights.component';

@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('InsightsComponent', () => {
  let component: InsightsComponent;
  let fixture: ComponentFixture<InsightsComponent>;
  let accountServiceSpy;

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'publishSelectedTab',
      ]);
      TestBed.configureTestingModule({
        declarations: [InsightsComponent, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: AccountService, useValue: accountServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(InsightsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call set height', () => {
      component.contentView = {
        nativeElement: jasmine.createSpyObj('NativeEl', [''], {
          offsetHeight: 500,
        }),
      };

      component.ngOnInit();
      expect(component.height).toEqual('530px');
    });
  });

  describe('ionViewWillEnter', () => {
    let widgetSpy;
    beforeEach(() => {
      widgetSpy = jasmine.createSpyObj('Widget', ['refreshWidget']);
      component.widget = widgetSpy;
    });

    it('should publish insights as selectedTab', () => {
      component.ionViewWillEnter();
      expect(accountServiceSpy.publishSelectedTab).toHaveBeenCalledWith(
        'insights'
      );
    });

    it('should set firstLoad to false if its true and not call refreshWidget', () => {
      component.firstLoad = true;

      component.ionViewWillEnter();
      expect(widgetSpy.refreshWidget).not.toHaveBeenCalled();
      expect(component.firstLoad).toBeFalse();
    });

    it('should call refreshWidget if not first load', () => {
      component.firstLoad = false;

      component.ionViewWillEnter();
      expect(widgetSpy.refreshWidget).toHaveBeenCalled();
    });
  });
});
