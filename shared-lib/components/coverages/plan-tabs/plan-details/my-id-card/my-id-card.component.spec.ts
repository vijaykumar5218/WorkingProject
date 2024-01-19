import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {MyIdCardComponent} from './my-id-card.component';
import {Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {of, Subscription} from 'rxjs';
import {ImageModal} from './image-modal/image-modal.page';
import {CardModalComponent} from './card-modal/card-modal.component';
import deleteContent from './card-modal/constants/pageText.json';

describe('MyIdCardComponent', () => {
  let component: MyIdCardComponent;
  let fixture: ComponentFixture<MyIdCardComponent>;
  let routerSpy;
  let utilServiceSpy;
  let modalControllerSpy;
  let benefitServiceSpy;
  let setCardImagesSpy;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      utilServiceSpy = jasmine.createSpyObj('utilServiceSpy', ['getIsWeb']);
      benefitServiceSpy = jasmine.createSpyObj('BenefitService', [
        'getIdCard',
        'imageOperation',
        'getCardImages',
        'uploadMyIdCard',
        'getSelectedBenefit',
        'getCardImages',
        'getIdCard',
        'flipCard',
        'getFlipCardSubject',
      ]);
      benefitServiceSpy.getSelectedBenefit.and.returnValue({id: 'id'});
      const benefit = {
        name: 'SelectedBenefit',
        coverage: 0,
        premium: 0,
        premiumFrequency: '',
        deductible: 0,
        type: '',
        id: 'id',
        deductibleObj: {
          coinsurance: 0,
          copay: 0,
          family: 0,
          individual: 0,
          single: 0,
        },
        coverage_levels: {
          subscriber: 0,
          spouse: 0,
          child: 0,
        },
        coverageType: '',
        first_name: '',
        benefit_type_title: '',
      };
      benefitServiceSpy.getSelectedBenefit.and.returnValue(benefit);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      TestBed.configureTestingModule({
        declarations: [MyIdCardComponent],
        imports: [IonicModule.forRoot(), BrowserAnimationsModule],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: SharedUtilityService, useValue: utilServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: BenefitsService, useValue: benefitServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MyIdCardComponent);
      component = fixture.componentInstance;
      benefitServiceSpy.getCardImages.and.returnValue(
        of({
          id: {
            cardFront: 'card-front',
            cardBack: 'card-back',
          },
        })
      );
      benefitServiceSpy.getFlipCardSubject.and.returnValue(of('front'));
      setCardImagesSpy = jasmine.createSpy();
      component['setCardImages'] = setCardImagesSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setCardImages', () => {
    let images;

    beforeEach(() => {
      images = {
        id: {
          cardFront: 'card-front',
          cardBack: 'card-back',
        },
      };
      component['benefitCards'] = images;
      component.benefitId = 'id';
      component.cardImage.cardFront = undefined;
      component.cardImage.cardBack = undefined;
      component['firstLoad'] = true;
      component['setCardImages'] = MyIdCardComponent.prototype['setCardImages'];
    });

    it('should not set cardFront and cardBack if there is no benefitId', () => {
      component.benefitId = undefined;
      component['setCardImages']();
      expect(component.cardImage.cardFront).toEqual(undefined);
      expect(component.cardImage.cardBack).toEqual(undefined);
      expect(component['firstLoad']).toBeTrue();
    });

    it('should not set cardFront and cardBack if there are no benefitCards', () => {
      component['benefitCards'] = undefined;
      component['setCardImages']();
      expect(component.cardImage.cardFront).toEqual(undefined);
      expect(component.cardImage.cardBack).toEqual(undefined);
    });

    it('should set to card-front and card-back if benefitId is set and benefitCards is set', () => {
      component['setCardImages']();
      expect(component['firstLoad']).toBeFalse();
      expect(component.cardImage.cardFront).toEqual('card-front');
      expect(component.cardImage.cardBack).toEqual('card-back');
    });

    it('should set to empty if no results for the current benefit', () => {
      images = {
        id2: {
          cardFront: 'front',
          cardBack: 'back',
        },
      };
      component['benefitCards'] = images;
      component['setCardImages']();
      expect(component.cardImage.cardFront).toEqual('');
      expect(component.cardImage.cardBack).toEqual('');
    });

    it('should call getIdCard if front and back are empty and its first time', () => {
      images.id.cardFront = '';
      images.id.cardBack = '';
      component['setCardImages']();
      expect(benefitServiceSpy.getIdCard).toHaveBeenCalled();
    });

    it('should not call getIdCard if front and back are empty but its not first time', () => {
      component['firstLoad'] = false;
      component['setCardImages']();
      expect(benefitServiceSpy.getIdCard).not.toHaveBeenCalled();
    });

    it('should not call getIdCard if front is empty and back is not', () => {
      images.id.cardFront = '';
      component['setCardImages']();
      expect(benefitServiceSpy.getIdCard).not.toHaveBeenCalled();
    });

    it('should not call getIdCard if front is not empty', () => {
      component.ngOnInit();
      expect(benefitServiceSpy.getIdCard).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should subscribe to getCardImages', () => {
      const images = {
        id: {
          cardFront: 'card-front',
          cardBack: 'card-back',
        },
      };
      const obs = of(images);
      const subscription = new Subscription();
      spyOn(component['subscription'], 'add');
      benefitServiceSpy.getCardImages.and.returnValue(obs);
      spyOn(obs, 'subscribe').and.callFake(f => {
        f(images);
        return subscription;
      });
      component['benefitCards'] = undefined;
      component.ngOnInit();
      expect(benefitServiceSpy.getCardImages).toHaveBeenCalled();
      expect(component['benefitCards']).toEqual(images);
      expect(setCardImagesSpy).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });

    it('should subscribe to getFlipCardSubject', () => {
      const flipState = 'front';
      const obs = of(flipState);
      const subscription = new Subscription();
      spyOn(component['subscription'], 'add');
      benefitServiceSpy.getCardImages.and.returnValue(obs);
      spyOn(obs, 'subscribe').and.callFake(f => {
        f(flipState);
        return subscription;
      });
      component.ngOnInit();
      expect(benefitServiceSpy.getFlipCardSubject).toHaveBeenCalled();
    });
  });

  describe('addACard', () => {
    it('should get isWeb from utility service and platform is Web', () => {
      utilServiceSpy.getIsWeb.and.returnValue(true);
      const selectedBenefit = benefitServiceSpy.getSelectedBenefit.and.returnValue(
        {
          name: 'SelectedBenefit',
        }
      );
      component.addACard();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        '/coverages/view-plans/' + selectedBenefit.id + '/details/add-card'
      );
    });

    it('should get isWeb from utility service and platform is mobile', () => {
      utilServiceSpy.getIsWeb.and.returnValue(false);
      component.addACard();
      expect(utilServiceSpy.getIsWeb).toHaveBeenCalled();
    });
  });

  describe('toggleFlip', () => {
    it('should set the value of flip to active', () => {
      component.flip = 'front';
      component.toggleFlip();
      expect(benefitServiceSpy.flipCard).toHaveBeenCalledWith('front');
    });
  });

  describe('showModal', () => {
    let modalSpy;

    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
    });

    it('should open modal', async () => {
      const componentProps = {component: 'props'};
      await component['showModal'](componentProps);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: CardModalComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: componentProps,
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });

  describe('deleteImage', () => {
    it('should call showModal with delete props', () => {
      component['showModal'] = jasmine.createSpy();
      component.deleteImage();
      expect(component['showModal']).toHaveBeenCalledWith({
        header: deleteContent.titleMessage,
        yesText: deleteContent.yes,
        noText: deleteContent.no,
        delete: true,
      });
    });
  });

  describe('showIdCard', () => {
    let modalSpy;

    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
    });

    it('should open image modal', async () => {
      const testImg = 'assets/fw-images/hands.png';
      await component.showIdCard(testImg);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: ImageModal,
        cssClass: 'id-image-viewer',
        componentProps: {
          img: testImg,
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });

    it('should call showIdCard methods when front side image is tapped', () => {
      const testCardFrontImage = 'assets/fw-images/hands.png';
      component.cardImage = {cardFront: testCardFrontImage, cardBack: ''};
      fixture.detectChanges();

      const frontImage = fixture.nativeElement.querySelector(
        '.tp-box__front .image-viewer'
      );
      const showIdCardSpy = spyOn(component, 'showIdCard');

      frontImage.click();
      expect(showIdCardSpy).toHaveBeenCalledWith(testCardFrontImage);
    });

    it('should call showIdCard methods when back side image is tapped', () => {
      const testCardBackImage = 'assets/fw-images/hands.png';
      component.cardImage = {cardFront: '', cardBack: testCardBackImage};
      fixture.detectChanges();

      const backImage = fixture.nativeElement.querySelector(
        '.tp-box__back .image-viewer'
      );
      const showIdCardSpy = spyOn(component, 'showIdCard');

      backImage.click();
      expect(showIdCardSpy).toHaveBeenCalledWith(testCardBackImage);
    });
  });
});
