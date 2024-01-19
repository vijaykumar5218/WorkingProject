import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {ErrorMessagePopupComponent} from './error-message-popup.component';

describe('ErrorMessagePopupComponent', () => {
  let component: ErrorMessagePopupComponent;
  let fixture: ComponentFixture<ErrorMessagePopupComponent>;

  const modalControllerSpy = jasmine.createSpyObj('ModalController', [
    'dismiss',
  ]);
  const navParamSpy = jasmine.createSpyObj('NavParams', ['get']);
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ErrorMessagePopupComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: NavParams, useValue: navParamSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ErrorMessagePopupComponent);
      component = fixture.componentInstance;
      component.element = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    it('should call closeDialog', () => {
      component.closeDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
