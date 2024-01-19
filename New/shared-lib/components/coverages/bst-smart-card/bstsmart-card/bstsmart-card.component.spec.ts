import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';

import {BSTSmartCardComponent} from './bstsmart-card.component';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
import {BSTSmartCardModalComponent} from '../bstsmart-card-modal/bstsmart-card-modal.component';

describe('BSTSmartCardComponent', () => {
  let component: BSTSmartCardComponent;
  let fixture: ComponentFixture<BSTSmartCardComponent>;
  let modalControllerSpy;
  let utilityServiceSpy;
  let routerSpy;
  let benefitServiceSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
      benefitServiceSpy = jasmine.createSpyObj('BenefitService', [
        'setSelectedSmartCard',
      ]);

      utilityServiceSpy.getIsWeb.and.returnValue(true);

      TestBed.configureTestingModule({
        declarations: [BSTSmartCardComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
          {provide: ModalController, useValue: modalControllerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BSTSmartCardComponent);
      component = fixture.componentInstance;

      component.content = {
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

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('linkClicked', () => {
    it('should route to coverages/smartCardModal and set selected smart card if web', () => {
      component.isWeb = true;

      component.linkClicked();

      expect(benefitServiceSpy.setSelectedSmartCard).toHaveBeenCalledWith(
        component.content
      );
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'coverages/smartCardModal'
      );
    });

    it('should open smart card modal if mobile', () => {
      component.isWeb = false;

      const modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));

      component.linkClicked();

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: BSTSmartCardModalComponent,
        componentProps: {
          smartCardContent: component.content,
        },
      });
    });
  });

  describe('closeClicked', () => {
    it('should call xButtonClicked.emit with the card id', () => {
      spyOn(component.xButtonClicked, 'emit');

      component.closeClicked();

      expect(component.xButtonClicked.emit).toHaveBeenCalledWith(
        component.content.name
      );
    });
  });
});
