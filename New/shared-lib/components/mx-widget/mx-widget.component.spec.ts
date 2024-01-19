import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {MXWidgetComponent, WIDGET_TIMOUT_DURATION} from './mx-widget.component';
import {PlatformService} from '@mobile/app/modules/shared/service/platform/platform.service';

describe('MXWidgetComponent', () => {
  let component: MXWidgetComponent;
  let fixture: ComponentFixture<MXWidgetComponent>;
  let mxServiceSpy;
  let platformServiceSpy;
  let resumeSpy;
  let pauseSpy;
  let refreshSpy;
  let sharedUtilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('MXService', ['displayWidget']);
      resumeSpy = jasmine.createSpyObj('OBJ', ['subscribe']);
      pauseSpy = jasmine.createSpyObj('OBJ', ['subscribe']);
      platformServiceSpy = jasmine.createSpyObj('Platform', [], {
        onResume$: resumeSpy,
        onPause$: pauseSpy,
      });

      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);

      TestBed.configureTestingModule({
        declarations: [MXWidgetComponent],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: MXService, useValue: mxServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MXWidgetComponent);
      component = fixture.componentInstance;

      refreshSpy = spyOn(component, 'refreshWidget');
      component['platformSubscription'] = jasmine.createSpyObj('Subscription', [
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
    beforeEach(() => {
      sharedUtilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
    });

    it('Should set isWeb', () => {
      expect(sharedUtilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toEqual(true);
    });
  });

  describe('onResume', () => {
    beforeEach(() => {
      jasmine.clock().install();
      refreshSpy.calls.reset();
    });

    it('should call refreshWidget if timout time has passed', () => {
      const time = new Date().getTime();
      jasmine.clock().mockDate(new Date(time));

      component['widgetTimeout'] = time - 200;
      component.onResume();

      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should not call refreshWidget if timout time has not passed', () => {
      const time = new Date().getTime();
      jasmine.clock().mockDate(new Date(time));

      component['widgetTimeout'] = time + 20000;
      component.onResume();

      expect(refreshSpy).not.toHaveBeenCalled();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });
  });

  describe('onPause', () => {
    let currTime;
    beforeEach(() => {
      jasmine.clock().install();

      currTime = new Date().getTime();
      jasmine.clock().mockDate(new Date(currTime));
    });

    it('should set timeout time', () => {
      component.onPause();
      expect(component['widgetTimeout']).toEqual(
        currTime + WIDGET_TIMOUT_DURATION
      );
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });
  });

  describe('refreshWidget', () => {
    beforeEach(() => {
      refreshSpy.and.callThrough();
    });

    it('should call displayWidget and set hasError to false', async () => {
      component.hasError = true;
      mxServiceSpy.displayWidget.and.returnValue(Promise.resolve(true));

      component.tagName = 'test-tag';
      component.widgetType = WidgetType.CONNECT;
      component.height = '400px';
      component.subAccount = true;

      await component.refreshWidget();
      expect(mxServiceSpy.displayWidget).toHaveBeenCalledWith(
        WidgetType.CONNECT,
        {
          id: 'test-tag',
          height: '400px',
          autoload: false,
        },
        true
      );
      expect(component.hasError).toBeFalse();
    });

    it('should call displayWidget and set hasError to true if error', async () => {
      component.hasError = false;
      mxServiceSpy.displayWidget.and.returnValue(Promise.resolve(false));

      component.tagName = 'test-tag';
      component.widgetType = WidgetType.CONNECT;
      component.height = '400px';
      component.subAccount = true;

      await component.refreshWidget();
      expect(mxServiceSpy.displayWidget).toHaveBeenCalledWith(
        WidgetType.CONNECT,
        {
          id: 'test-tag',
          height: '400px',
          autoload: false,
        },
        true
      );
      expect(component.hasError).toBeTrue();
    });
  });
});
