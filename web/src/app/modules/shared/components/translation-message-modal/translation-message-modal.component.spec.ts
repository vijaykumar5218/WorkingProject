import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';

import {TranslationMessageModalComponent} from './translation-message-modal.component';

describe('TranslationMessageModalComponent', () => {
  let component: TranslationMessageModalComponent;
  let fixture: ComponentFixture<TranslationMessageModalComponent>;
  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('modal', ['dismiss']);
      TestBed.configureTestingModule({
        declarations: [TranslationMessageModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: ModalController, useValue: modalControllerSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(TranslationMessageModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
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
