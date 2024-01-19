import {Component, Input} from '@angular/core';
import {ComponentFixture, waitForAsync, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {BenefitsSummaryModalContent} from '@shared-lib/services/benefits/models/benefits.model';
import {BenefitsSelectionModalComponent} from './modal.component';
import {ModalPresentationService} from '../../../services/modal-presentation/modal-presentation.service';

@Component({selector: 'benefits-selection-modal-nudge', template: ''})
class MockNudgeComponent {
  @Input() content;
}

@Component({selector: 'benefits-selection-modal-before-starting', template: ''})
class MockBeforeStartingComponent {
  @Input() modalContent;
}

describe('BenefitsSelectionModalComponent', () => {
  let component: BenefitsSelectionModalComponent;
  let fixture: ComponentFixture<BenefitsSelectionModalComponent>;
  let getBenefitModalDataSpy;
  let benefitServiceSpy;
  let modalPresentationServiceSpy;

  beforeEach(
    waitForAsync(() => {
      benefitServiceSpy = jasmine.createSpyObj('BenefitService', [
        'getBenefitsSelectionModalContent',
        'setSmartBannerEnableConditions',
      ]);
      modalPresentationServiceSpy = jasmine.createSpyObj(
        'ModalPresentationService',
        ['dismiss']
      );
      TestBed.configureTestingModule({
        declarations: [
          BenefitsSelectionModalComponent,
          MockNudgeComponent,
          MockBeforeStartingComponent,
        ],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitServiceSpy},
          {
            provide: ModalPresentationService,
            useValue: modalPresentationServiceSpy,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BenefitsSelectionModalComponent);
      component = fixture.componentInstance;
      getBenefitModalDataSpy = spyOn(component, 'getBenefitModalData');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getBenefitModal', () => {
      expect(getBenefitModalDataSpy).toHaveBeenCalled();
    });
  });

  describe('getBenefitModalData', () => {
    beforeEach(() => {
      getBenefitModalDataSpy.and.callThrough();
    });

    it('should call getBenefitsSelectionModalContent', async () => {
      component.content = undefined;
      const modalContent: BenefitsSummaryModalContent = {
        nudge: {
          icon: 'assets/icon/benefits/calendar.svg',
          altText: '',
          header: "Let's do this!",
          desc1: 'Time to select your benefits for the year',
          desc2:
            'Answer some questions in the following pages to get a recommendation for the benefits you should select for this year, based on your past and anticipated future needs.',
          buttonText: 'Select Your Benefits',
          linkText: 'See your current summary of benefits',
          desc: 'See your current summary of benefits',
        },
        beforeStarting: {
          header: 'Before you get started:',
          descList: [
            'myHealth &Wealth will help you understand the impact of your benefit choices and make informed decisions all in one place.',
            'When you access myHealth*Wealth, you will be asked a series of questions about your household, your coverage needs and your savings goals.',
            'It is important to note that once you receive your benefits guidance, you will still need to access your enrollment in Workday to make your elections and complete your enrollment.',
          ],
          descNote:
            'You will not be enrolled in the benefits unless you complete this step!',
          usefulInfoHeader: 'Useful information to have on hand:',
          usefulInfoDescList: [
            'Current HSA, FSA account balances',
            'Current emergency savings balance',
            'Spouse/dependent benefit plan details (deductible, coinsurance, premiums) if you would like those plans to be included in the guidance experience',
          ],
          buttonLabel: 'Continue',
        },
        nudgeInProgress: {
          icon: 'assets/icon/benefits/calendar.svg',
          altText: '',
          header: "Let's do this!",
          desc1: 'Time to select your benefits for the year',
          desc2:
            'Answer some questions in the following pages to get a recommendation for the benefits you should select for this year, based on your past and anticipated future needs.',
          buttonText: 'Select Your Benefits',
          linkText: 'See your current summary of benefits',
          desc: 'See your current summary of benefits',
        },
      };
      benefitServiceSpy.getBenefitsSelectionModalContent.and.returnValue(
        Promise.resolve(modalContent)
      );
      await component.getBenefitModalData();
      expect(
        benefitServiceSpy.getBenefitsSelectionModalContent
      ).toHaveBeenCalled();
      expect(component.content).toEqual(modalContent);
    });
  });

  describe('handleSelectBenefitsClick', () => {
    it('should set showBeforeStarting to true and set the icon path', () => {
      component.showBeforeStarting = false;
      component.handleSelectBenefitsClick();
      expect(component.showBeforeStarting).toBeTrue();
      expect(component.exitIconPath).toEqual('assets/icon/exit.svg');
    });
  });

  describe('closeModal', () => {
    it('should call dismiss', () => {
      component.closeModal();
      expect(
        benefitServiceSpy.setSmartBannerEnableConditions
      ).toHaveBeenCalledWith({isSmartBannerHidden: false});
      expect(modalPresentationServiceSpy.dismiss).toHaveBeenCalled();
    });
  });
});
