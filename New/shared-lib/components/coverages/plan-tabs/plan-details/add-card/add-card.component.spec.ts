import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AddCardComponent} from './add-card.component';
import {Location} from '@angular/common';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {card} from '@shared-lib/components/coverages/plan-tabs/plan-details/my-id-card/constants/camera.enum';
import {of, Subscription} from 'rxjs';

describe('AddCardComponent', () => {
  let component: AddCardComponent;
  let fixture: ComponentFixture<AddCardComponent>;
  let benefitServiceSpy;
  let locationSpy;

  beforeEach(
    waitForAsync(() => {
      locationSpy = jasmine.createSpyObj('Location ', ['back']);
      benefitServiceSpy = jasmine.createSpyObj('BenefitService', [
        'uploadMyIdCard',
        'getSelectedBenefit',
        'getCardImages',
        'getIdCard',
        'flipCard',
        'trimBase64MetaData',
      ]);
      benefitServiceSpy.getSelectedBenefit.and.returnValue({id: 'id'});
      TestBed.configureTestingModule({
        declarations: [AddCardComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitServiceSpy},
          {provide: Location, useValue: locationSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AddCardComponent);
      component = fixture.componentInstance;
      benefitServiceSpy.getCardImages.and.returnValue(
        of({
          id: {
            cardFront: 'card-front',
            cardBack: 'card-back',
          },
        })
      );
      fixture.detectChanges();
    })
  );
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addCard', () => {
    let image;
    beforeEach(() => {
      image = {
        base64String:
          'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=',
        dataUrl:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=',
        path: 'path',
        webPath: 'path',
        exif: '',
        format: 'JPEG',
        saved: false,
      };
      component.cardFront = '';
      component.cardBack = '';
    });
    it('if card side is BACK', () => {
      component.addCard(image.base64String, card.BACK);
      expect(component.cardFront).toEqual('');
      expect(component.cardBack).toEqual(image.base64String);
    });
    it('if card side is FRONT', () => {
      component.addCard(image.base64String, card.FRONT);
      expect(component.cardFront).toEqual(image.base64String);
      expect(component.cardBack).toEqual('');
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
      component.ngOnInit();
      expect(benefitServiceSpy.getCardImages).toHaveBeenCalled();
      expect(component.cardFront).toEqual('card-front');
      expect(component.cardBack).toEqual('card-back');
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });

    it('should set to empty if no results for the current benefit', () => {
      benefitServiceSpy.getCardImages.and.returnValue(
        of({
          id2: {
            cardFront: 'front',
            cardBack: 'back',
          },
        })
      );
      component.ngOnInit();
      expect(component.cardFront).toEqual('');
      expect(component.cardBack).toEqual('');
    });

    it('should call getIdCard if front and back are empty and its first time', () => {
      benefitServiceSpy.getCardImages.and.returnValue(
        of({
          id: {
            cardFront: '',
            cardBack: '',
          },
        })
      );
      component.ngOnInit();
      expect(benefitServiceSpy.getIdCard).toHaveBeenCalled();
    });
  });

  describe('uploadCard', () => {
    beforeEach(() => {
      component.cardFront = '';
      component.cardBack = '';
    });
    it('should call uploadCard', async () => {
      component.cardFront = 'file-upload,';
      component.cardBack = 'data-file,';
      benefitServiceSpy.trimBase64MetaData.and.callFake(
        str => str + 'fileUpload'
      );
      spyOn(component, 'close');
      await component.uploadCard();
      expect(benefitServiceSpy.uploadMyIdCard).toHaveBeenCalledWith({
        cardFront: 'file-upload,fileUpload',
        cardBack: 'data-file,fileUpload',
      });
      expect(component.close).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should call location back', () => {
      component.close();
      expect(benefitServiceSpy.flipCard).toHaveBeenCalledWith('back');
      expect(locationSpy.back).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscription', () => {
      component['subscription'] = jasmine.createSpyObj('subscription', [
        'unsubscribe',
      ]);
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
