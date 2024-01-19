import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, Platform} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {NetWorthComponent} from './net-worth.component';
import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {of} from 'rxjs';
import {AccessService} from '@shared-lib/services/access/access.service';

@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() isMiniWidget: boolean;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('NetWorthComponent', () => {
  let component: NetWorthComponent;
  let fixture: ComponentFixture<NetWorthComponent>;
  let routerSpy;
  let platformSpy;
  let utilitySpy;
  let mxServiceSpy;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      platformSpy = jasmine.createSpyObj('Platform', ['is']);
      utilitySpy = jasmine.createSpyObj('SharedUtilityService', ['getIsWeb']);
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getIsMxUserByMyvoyageAccess',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);

      TestBed.configureTestingModule({
        declarations: [NetWorthComponent, MockMXWidgetComponent],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: Platform, useValue: platformSpy},
          {provide: SharedUtilityService, useValue: utilitySpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NetWorthComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'fetchData');
    });

    it('should call fetchData if usePlaceholder', () => {
      component.usePlaceholder = true;
      component.ngOnInit();
      expect(component.fetchData).toHaveBeenCalled();
    });

    it('should not call fetchData if not usePlaceholder', () => {
      component.usePlaceholder = false;
      component.ngOnInit();
      expect(component.fetchData).not.toHaveBeenCalled();
    });

    it('should set platform to true if tablet', () => {
      platformSpy.is.and.returnValue(true);

      component.ngOnInit();
      expect(platformSpy.is).toHaveBeenCalledWith('tablet');
      expect(component.isTablet).toBeTrue();
    });

    it('should set platform to false if not tablet', () => {
      platformSpy.is.and.returnValue(false);

      component.ngOnInit();
      expect(platformSpy.is).toHaveBeenCalledWith('tablet');
      expect(component.isTablet).toBeFalse();
    });

    it('should get isWeb return value', () => {
      utilitySpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(utilitySpy.getIsWeb).toHaveBeenCalled();
    });

    it('should get isMiniWidget return value', () => {
      component.isMiniWidget = true;
      component.ngOnInit();
      expect(component.isTablet).toEqual(false);
    });
  });

  describe('fetchData', () => {
    it('should call getIsMxUserByMyvoyageAccess and checkMyvoyageAccess and set showNudge to false if isMxUser and isHealthOnly', async () => {
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isHealthOnly: true})
      );

      await component.fetchData();
      expect(component.showNudge).toBeFalse();
    });

    it('should call getIsMxUserByMyvoyageAccess and checkMyvoyageAccess and set showNudge to false if isMxUser and !isHealthOnly', async () => {
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(true));
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isHealthOnly: false})
      );

      await component.fetchData();
      expect(component.showNudge).toBeFalse();
    });

    it('should call getIsMxUserByMyvoyageAccess and checkMyvoyageAccess and set showNudge to true if !isMxUser and isHealthOnly', async () => {
      mxServiceSpy.getIsMxUserByMyvoyageAccess.and.returnValue(of(false));
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({isHealthOnly: true})
      );

      await component.fetchData();
      expect(component.showNudge).toBeTrue();
    });
  });

  describe('netWorthClicked', () => {
    it('should route to net-worth', () => {
      component.netWorthClicked();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('net-worth');
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe if subscription is not null', () => {
      component.subscription = jasmine.createSpyObj('Sub', ['unsubscribe']);

      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
