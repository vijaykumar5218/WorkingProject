import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BSTSmartCardModalComponent} from './bstsmart-card-modal.component';
import {Location} from '@angular/common';
import {BSTSmartCardContent} from '@shared-lib/services/benefits/models/noBenefit.model';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {ElementRef} from '@angular/core';
import {of} from 'rxjs';
import {Router} from '@angular/router';

describe('BSTSmartCardModalComponent', () => {
  let component: BSTSmartCardModalComponent;
  let fixture: ComponentFixture<BSTSmartCardModalComponent>;
  let modalControllerSpy;
  let benefitServiceSpy;
  let utilityServiceSpy;
  let locationSpy;
  let routerSpy;
  let smartCardCont: BSTSmartCardContent;
  let scrollToTopSpy;

  beforeEach(
    waitForAsync(() => {
      smartCardCont = {
        name: 'sc_3',
        header: 'head',
        header_img: 'img',
        body: 'body',
        body_img: 'body_img',
        link_text: 'link_text',
        modalContent: {
          modalHeader: 'mod_head',
          topHeader: 'top_head',
          topBody: 'top_bod',
          topImage: 'top_img',
          bodyParts: [
            {
              header: 'head',
              body: 'bod',
            },
          ],
        },
      };

      locationSpy = jasmine.createSpyObj('Location', ['back']);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'getIsWeb',
        'scrollToTop',
      ]);
      modalControllerSpy = jasmine.createSpyObj('ModalService', ['dismiss']);
      benefitServiceSpy = jasmine.createSpyObj('BenefitServiceSpy', [
        'getSelectedSmartCard',
      ]);
      routerSpy = {
        events: {
          pipe: jasmine.createSpy().and.returnValue(
            of({
              id: 1,
              url: '/coverages/smartCardModal',
            })
          ),
        },
        navigateByUrl: jasmine.createSpy(),
      };

      TestBed.configureTestingModule({
        declarations: [BSTSmartCardModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: BenefitsService, useValue: benefitServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Location, useValue: locationSpy},
          {provide: Router, useValue: routerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BSTSmartCardModalComponent);
      component = fixture.componentInstance;

      scrollToTopSpy = spyOn(component, 'scrollToTop');

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get smartCardContent from benefitService if isWeb', () => {
      benefitServiceSpy.getSelectedSmartCard.and.returnValue(smartCardCont);

      component.isWeb = true;
      component.ngOnInit();

      expect(benefitServiceSpy.getSelectedSmartCard).toHaveBeenCalled();

      expect(component.smartCardContent).toEqual(smartCardCont);
    });

    it('should not get smartCardContent from benefitService if !isWeb', () => {
      benefitServiceSpy.getSelectedSmartCard.and.returnValue(smartCardCont);

      component.isWeb = false;
      component.ngOnInit();

      expect(benefitServiceSpy.getSelectedSmartCard).not.toHaveBeenCalled();
    });
  });

  describe('scrollToTop', () => {
    beforeEach(() => {
      scrollToTopSpy.and.callThrough();
      component.topmostElement = {
        nativeElement: jasmine.createSpyObj('nativeElement', [
          'scrollIntoView',
        ]),
      } as ElementRef;
    });
    it('should call scroll to top', fakeAsync(() => {
      component.scrollToTop();
      expect(routerSpy.events.pipe).toHaveBeenCalled();
      tick(100);
      expect(utilityServiceSpy.scrollToTop).toHaveBeenCalledWith(
        component.topmostElement
      );
    }));
  });

  describe('radioOptionClicked', () => {
    it('should set radioOption', () => {
      component.radioOption = 'no';
      component.radioOptionClicked('yes');
      expect(component.radioOption).toEqual('yes');
    });
  });

  describe('saveButtonClicked', () => {
    it('should call location.back if isWeb', () => {
      component.isWeb = true;
      component.saveButtonClicked();
      expect(locationSpy.back).toHaveBeenCalled();
    });

    it('should call modal dismiss, if !isWeb', () => {
      component.isWeb = false;
      component.saveButtonClicked();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      component.subscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
      component.ngOnDestroy();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
