import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {LanguageDisclamerModalComponent} from './language-disclaimer-modal.component';

describe('LanguageDisclamerComponent', () => {
  let component: LanguageDisclamerModalComponent;
  let fixture: ComponentFixture<LanguageDisclamerModalComponent>;
  let modalControllerSpy;
  const myWindow = {
    location: {
      reload() {
        return 'something';
      },
    },
  };
  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('modal', ['dismiss']);
      TestBed.configureTestingModule({
        declarations: [LanguageDisclamerModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: ModalController, useValue: modalControllerSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(LanguageDisclamerModalComponent);
      component = fixture.componentInstance;
      component.compWindow = myWindow;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('closeDialogClicked', () => {
    it('should close modal when closeDialogClicked is called ', () => {
      component.closeDialogClicked();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
