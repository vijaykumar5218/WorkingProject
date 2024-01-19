import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {AccountWidgetsComponent} from './account-widget.component';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {Component, Input} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {Router} from '@angular/router';
import {AccessService} from '@shared-lib/services/access/access.service';
import {Platform} from '@ionic/angular';

@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  widgetButtonText: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('AccountWidgetsComponent', () => {
  let component: AccountWidgetsComponent;
  let fixture: ComponentFixture<AccountWidgetsComponent>;
  let mxServiceSpy;
  let routerSpy;
  let accessServiceSpy;
  let platformSpy;

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getIsMxUserByMyvoyageAccess',
      ]);
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          isHealthOnly: true,
          isAltAccessUser: true,
        })
      );
      platformSpy = jasmine.createSpyObj('Platform', ['is']);
      platformSpy.is.and.returnValue(true);

      TestBed.configureTestingModule({
        declarations: [AccountWidgetsComponent, MockMXWidgetComponent],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: Platform, useValue: platformSpy},
        ],
        imports: [RouterTestingModule],
      }).compileComponents();
      fixture = TestBed.createComponent(AccountWidgetsComponent);
      component = fixture.componentInstance;
      component['subscription'] = jasmine.createSpyObj('subscription', [
        'add',
        'unsubscribe',
      ]);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call accessService checkMyvoyageAccess and set isHealthOnly', () => {
      expect(component.isHealthOnly).toBeTrue();
    });

    it('should disable the dropdown if isPowerUser is true', () => {
      expect(component.isAltAccessUser).toBeTrue();
      const dropdown = fixture.debugElement.nativeElement.querySelectorAll(
        '.dropdown'
      );
      dropdown.forEach((dropdown: HTMLSelectElement) => {
        expect(dropdown.disabled).toBeTrue();
      });
    });

    it('should call getIsMxUserByMyvoyageAccess and set hasAccounts', () => {
      expect(mxServiceSpy.getIsMxUserByMyvoyageAccess).toHaveBeenCalled();
      expect(component.hasAccounts).toBeTrue();
    });
    it('should call platform.is and set isIos if true', () => {
      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(component.isIos).toBeTrue();
    });
  });

  describe('changeWidgetsType', () => {
    let widgetSpy;
    beforeEach(() => {
      widgetSpy = jasmine.createSpyObj('Widget', ['refreshWidget']);
      component.widget = widgetSpy;
      component.isRefreshWidget = false;
    });

    it('when widgetType will be NET_WORTH_MINI', fakeAsync(() => {
      const event = {
        detail: {value: WidgetType.NET_WORTH_MINI},
      };
      component.changeWidgetsType(event);
      expect(component.widgetType).toEqual(WidgetType.NET_WORTH_MINI);
      expect(component.widgetButtonText).toEqual('View Net Worth');
      expect(component.isRefreshWidget).toEqual(false);
      tick(25);
      expect(widgetSpy.refreshWidget).not.toHaveBeenCalled();
    }));

    it('when widgetType will be MINI_SPENDING_WIDGET', fakeAsync(() => {
      const event = {
        detail: {value: WidgetType.MINI_SPENDING_WIDGET},
      };
      component.changeWidgetsType(event);
      expect(component.widgetType).toEqual(WidgetType.MINI_SPENDING_WIDGET);
      expect(component.widgetButtonText).toEqual('View Spending');
      expect(component.isRefreshWidget).toEqual(true);
      tick(25);
      expect(widgetSpy.refreshWidget).toHaveBeenCalled();
    }));

    it('when widgetType will be MINI_BUDGET_WIDGET', fakeAsync(() => {
      const event = {
        detail: {value: WidgetType.MINI_BUDGET_WIDGET},
      };
      component.changeWidgetsType(event);
      expect(component.widgetType).toEqual(WidgetType.MINI_BUDGET_WIDGET);
      expect(component.widgetButtonText).toEqual('View Budget');
      expect(component.isRefreshWidget).toEqual(true);
      tick(25);
      expect(widgetSpy.refreshWidget).toHaveBeenCalled();
    }));

    it('when widgetType will be null', fakeAsync(() => {
      const event = {
        detail: {value: ''},
      };
      component.changeWidgetsType(event);
      expect(component.isRefreshWidget).toEqual(false);
      expect(component.widgetButtonText).toEqual('View Net Worth');
      tick(25);
      expect(widgetSpy.refreshWidget).not.toHaveBeenCalled();
    }));
  });

  describe('navigateToAccounts', () => {
    it('should navigate to accounts page', () => {
      component.navigateToAccounts();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('accounts');
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
