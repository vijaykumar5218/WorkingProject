import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {CardModalComponent} from './card-modal.component';
import {BenefitsService} from '../../../../../../services/benefits/benefits.service';
import {AndroidSettings, IOSSettings} from 'capacitor-native-settings';

describe('CardModalComponent', () => {
  let component: CardModalComponent;
  let fixture: ComponentFixture<CardModalComponent>;
  let modalControllerSpy;
  let benefitServiceSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      benefitServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'deleteMedicalCard',
      ]);
      TestBed.configureTestingModule({
        declarations: [CardModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: BenefitsService, useValue: benefitServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CardModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteCard', () => {
    let nativeSettings;
    beforeEach(() => {
      nativeSettings = jasmine.createSpyObj('NativeSettings', ['open']);
      component['nativeSettings'] = nativeSettings;
    });

    it('should call deleteMedicalCard if delete is true', async () => {
      component.delete = true;
      await component.deleteCard();
      expect(benefitServiceSpy.deleteMedicalCard).toHaveBeenCalled();
    });

    it('should not call deleteMedicalCard if delete is false', async () => {
      component.delete = false;
      await component.deleteCard();
      expect(benefitServiceSpy.deleteMedicalCard).not.toHaveBeenCalled();
    });

    it('should call redirect to Settings if redirectToSetting is true', async () => {
      component.redirectToSetting = true;
      await component.deleteCard();
      expect(nativeSettings.open).toHaveBeenCalledWith({
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App,
      });
    });

    it('should not redirect to Settings if redirectToSetting is false', async () => {
      component.redirectToSetting = false;
      await component.deleteCard();
      expect(nativeSettings.open).not.toHaveBeenCalledWith({
        optionAndroid: AndroidSettings.ApplicationDetails,
        optionIOS: IOSSettings.App,
      });
    });

    it('should call closeModal', async () => {
      await component.deleteCard();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('closeModal', () => {
    it('should call closeModal', () => {
      component.closeModal();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
