import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';

import {AlertComponent} from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      TestBed.configureTestingModule({
        declarations: [AlertComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: ModalController, useValue: modalControllerSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(AlertComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    it('should call dismiss with "saved"=true', () => {
      component.closeDialog(true);
      expect(modalControllerSpy.dismiss).toHaveBeenCalledWith({
        saved: true,
      });
    });

    it('should call dismiss with "saved"=false', () => {
      component.closeDialog(false);
      expect(modalControllerSpy.dismiss).toHaveBeenCalledWith({
        saved: false,
      });
    });
  });

  describe('closeDialogClicked', () => {
    it('should just call close if save=false', () => {
      spyOn(component, 'closeDialog');
      component.closeDialogClicked(false);
      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('should check for save function if save=true', async () => {
      spyOn(component, 'closeDialog');
      component.saveFunction = () => {
        return Promise.resolve(true);
      };
      await component.closeDialogClicked(true);
      expect(component.closeDialog).toHaveBeenCalledWith(true);
    });

    it('should check for save function if save=true and show error is save function returns false', async () => {
      spyOn(component, 'closeDialog');
      component.saveFunction = () => {
        return Promise.resolve(false);
      };
      await component.closeDialogClicked(true);
      expect(component.error).toEqual(true);
      expect(component.closeDialog).not.toHaveBeenCalled();
    });

    it('should just close if save=true and no save function', async () => {
      spyOn(component, 'closeDialog');
      component.saveFunction = null;
      await component.closeDialogClicked(true);
      expect(component.closeDialog).toHaveBeenCalled();
    });
  });
});
