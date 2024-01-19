import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {BSTSmartCardListComponent} from './bstsmart-card-list.component';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {
  BSTSmartCardContent,
  NoBenefitContent,
} from '@shared-lib/services/benefits/models/noBenefit.model';
import {BSTSmartCardData} from '@shared-lib/services/benefits/models/benefits.model';

describe('BSTSmartCardListComponent', () => {
  let component: BSTSmartCardListComponent;
  let fixture: ComponentFixture<BSTSmartCardListComponent>;
  let benefitsServiceSpy;
  let utilityServiceSpy;
  let setUpCardContentSpy;

  const scCont1: BSTSmartCardContent = {
    name: 'sc1',
    body: 'Test 1',
    modalContent: {
      topBody: 'Test 1 modal',
    },
  } as BSTSmartCardContent;

  const scCont2: BSTSmartCardContent = {
    name: 'sc2',
    body:
      'Body <druglist>Test {alternativeNdcName} and {currentNdcName}</druglist>',
    modalContent: {
      topBody:
        'Modal <druglist>Test {alternativeNdcName} and {currentNdcName}</druglist>',
    },
  } as BSTSmartCardContent;

  const scDat: BSTSmartCardData = {
    sc1: true,
    sc2: false,
    sc6: false,
    sc7: false,
    sc8: false,
    smartcardDetail: [
      {
        currentNdcName: 'curr_drug',
        alternativeNdcName: 'alt_drug',
      },
      {
        currentNdcName: 'curr_drug2',
        alternativeNdcName: 'alt_drug2',
      },
    ],
  } as BSTSmartCardData;

  const scDatNull: BSTSmartCardData = {
    sc1: true,
    sc2: false,
    sc6: false,
    sc7: false,
    sc8: false,
    smartcardDetail: null,
  } as BSTSmartCardData;

  beforeEach(
    waitForAsync(() => {
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'getNoBenefitContents',
        'fetchBstSmartCards',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);

      benefitsServiceSpy.fetchBstSmartCards.and.returnValue(
        Promise.resolve(scDat)
      );

      const content = {
        Insights_BSTsmartcard_Nudge: JSON.stringify([scCont1, scCont2]),
      } as NoBenefitContent;
      benefitsServiceSpy.getNoBenefitContents.and.returnValue(
        Promise.resolve(content)
      );
      utilityServiceSpy.getIsWeb.and.returnValue(true);

      TestBed.configureTestingModule({
        declarations: [BSTSmartCardListComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BSTSmartCardListComponent);
      component = fixture.componentInstance;

      setUpCardContentSpy = spyOn(component, 'setUpCardContent');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getNoBenefitContents and call setUpCardContent with the result', async () => {
      await component.ngOnInit();
      expect(benefitsServiceSpy.getNoBenefitContents).toHaveBeenCalled();
      expect(component.setUpCardContent).toHaveBeenCalledWith(
        [scCont1, scCont2],
        scDat
      );
    });

    it('should call getIsWeb and set isWeb', async () => {
      await component.ngOnInit();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.isWeb).toEqual(true);
    });
  });

  describe('setUpCardContent', () => {
    beforeEach(() => {
      setUpCardContentSpy.and.callThrough();
    });

    it('should loop through and setup smart card content', () => {
      const scc1 = JSON.parse(JSON.stringify(scCont1));
      const scc2 = JSON.parse(JSON.stringify(scCont2));

      component.setUpCardContent([scc1, scc2], scDat);
      expect(component.cards).toEqual([
        {
          name: 'sc1',
          body: 'Test 1',
          modalContent: {
            topBody: 'Test 1 modal',
          },
          show: true,
        } as BSTSmartCardContent,
        {
          name: 'sc2',
          body:
            'Body Test alt_drug and curr_drug<br><br>Test alt_drug2 and curr_drug2',
          modalContent: {
            topBody:
              'Modal Test alt_drug and curr_drug<br><br>Test alt_drug2 and curr_drug2',
          },
          show: false,
        } as BSTSmartCardContent,
      ]);
    });

    it('should not change any data if smartcardDetail is null', () => {
      const scc1 = JSON.parse(JSON.stringify(scCont1));
      const scc2 = JSON.parse(JSON.stringify(scCont2));

      component.setUpCardContent([scc1, scc2], scDatNull);
      expect(component.cards).toEqual([
        {
          name: 'sc1',
          body: 'Test 1',
          modalContent: {
            topBody: 'Test 1 modal',
          },
          show: true,
        } as BSTSmartCardContent,
        {
          name: 'sc2',
          body:
            'Body <druglist>Test {alternativeNdcName} and {currentNdcName}</druglist>',
          modalContent: {
            topBody:
              'Modal <druglist>Test {alternativeNdcName} and {currentNdcName}</druglist>',
          },
          show: false,
        } as BSTSmartCardContent,
      ]);
    });
  });
});
