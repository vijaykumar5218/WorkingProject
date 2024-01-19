import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {of, Subscription} from 'rxjs';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {InsightPage} from './insights.page';

describe('InsightPage', () => {
  let component: InsightPage;
  let fixture: ComponentFixture<InsightPage>;
  let mxServiceSpy;

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'hasUser',
        'displayWidget',
        'checkIsAltAccessUser',
      ]);
      mxServiceSpy.hasUser.and.returnValue({
        subscribe: () => undefined,
      });
      mxServiceSpy.checkIsAltAccessUser.and.returnValue({
        subscribe: () => undefined,
      });

      TestBed.configureTestingModule({
        declarations: [InsightPage],
        imports: [RouterTestingModule],
        providers: [{provide: MXService, useValue: mxServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(InsightPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component.subscription, 'add');
      component.hasMXUser = false;
      component.isAltAccessUser = false;
    });
    it('should call MXService displayWidget if hasUser is true', () => {
      const observable = of(true);
      const subscription = new Subscription();
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(true);
        return subscription;
      });
      mxServiceSpy.hasUser.and.returnValue(observable);
      mxServiceSpy.checkIsAltAccessUser.and.returnValue(observable);
      component.ngOnInit();
      expect(component.hasMXUser).toEqual(true);
      expect(mxServiceSpy.hasUser).toHaveBeenCalled();
      expect(mxServiceSpy.displayWidget).toHaveBeenCalledWith(
        WidgetType.PULSE,
        {
          id: 'pulse_widget',
          height: '100%',
          autoload: false,
        }
      );
      expect(component.subscription.add).toHaveBeenCalledWith(subscription);
    });
    it('should not call displayWidget if hasUser is false', () => {
      mxServiceSpy.hasUser.and.returnValue(of(false));
      component.ngOnInit();
      expect(component.hasMXUser).toEqual(false);
      expect(mxServiceSpy.displayWidget).toHaveBeenCalled();
    });
     it('should call checkIsAltAccessUser and set AltAccessUser to true', () => {
      component.ngOnInit();
      component.isAltAccessUser = true;
      expect(component.isAltAccessUser).toEqual(true);
      expect(mxServiceSpy.checkIsAltAccessUser).toHaveBeenCalled();
      expect(component.isAltAccessUser).toBeTrue();
     });
     it('should call checkIsAltAccessUser and set AltAccessUser to false', () => {
      component.ngOnInit();
      expect(component.isAltAccessUser).toEqual(false);
      expect(mxServiceSpy.checkIsAltAccessUser).toHaveBeenCalled();
      expect(component.isAltAccessUser).toBeFalse();
     });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      spyOn(component.subscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
