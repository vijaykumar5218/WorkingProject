import {Location} from '@angular/common';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router, RouterModule} from '@angular/router';
import {IonicModule, ModalController} from '@ionic/angular';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {ModalHeaderComponent} from './modal-header.component';

describe('ModalHeaderComponent', () => {
  let component: ModalHeaderComponent;
  let fixture: ComponentFixture<ModalHeaderComponent>;
  let modalControllerSpy;
  let locationSpy;
  let mxServiceSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      locationSpy = jasmine.createSpyObj('Location', ['back']);
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getMxMemberConnect',
        'getMxAccountConnect',
        'removeMXWindowEventListener',
      ]);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      TestBed.configureTestingModule({
        declarations: [ModalHeaderComponent],
        imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: Location, useValue: locationSpy},
          {provide: Router, useValue: routerSpy},
          {provide: MXService, useValue: mxServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ModalHeaderComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    it('should call back if back is true and backUrl is undefined', () => {
      component.back = true;
      component.backUrl = undefined;
      component.closeDialog();
      expect(locationSpy.back).toHaveBeenCalled();
    });

    it('should call navigateByUrl if back is true and backUrl is defined', () => {
      component.back = true;
      component.backUrl = 'coverages/all-coverages/insights';
      component.closeDialog();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(component.backUrl);
    });

    it('should call dismiss if back is false', () => {
      component.back = false;
      component.closeDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });

    it('should call dismiss if back is false and mxAccount is true', () => {
      component.back = false;
      component.mxAccount = true;
      component.closeDialog();
      expect(mxServiceSpy.getMxMemberConnect).toHaveBeenCalledWith(true);
      expect(mxServiceSpy.getMxAccountConnect).toHaveBeenCalledWith(true);
      expect(mxServiceSpy.removeMXWindowEventListener).toHaveBeenCalled();
    });
  });
});
