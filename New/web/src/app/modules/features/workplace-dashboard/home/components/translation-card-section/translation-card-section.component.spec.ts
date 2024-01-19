import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {TranslationMessageModalComponent} from '@web/app/modules/shared/components/translation-message-modal/translation-message-modal.component';
import {TranslationCardSectionComponent} from './translation-card-section.component';

describe('TranslationCardSectionComponent', () => {
  let component: TranslationCardSectionComponent;
  let fixture: ComponentFixture<TranslationCardSectionComponent>;
  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      TestBed.configureTestingModule({
        declarations: [TranslationCardSectionComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: ModalController, useValue: modalControllerSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(TranslationCardSectionComponent);
      component = fixture.componentInstance;
      component.translationObject = {
        linkText: 'link',
        message: 'Message here',
        buttonText: 'Close',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('openTranslationMessageModal', () => {
    it('should open modal with values', async () => {
      const modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      await component.openTranslationMessageModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: TranslationMessageModalComponent,
        cssClass: ['modal-not-fullscreen', 'translation-card-modal'],
        componentProps: {
          message: 'Message here',
          buttonText: 'Close',
        },
      });
    });
  });
});
