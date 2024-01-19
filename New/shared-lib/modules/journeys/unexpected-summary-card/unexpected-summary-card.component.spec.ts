import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {UnExpectedService} from '@shared-lib/services/journey/unExpectedService/unExpected.service';
import {of, Subscription} from 'rxjs';
import {UnExpectedExpensesSummaryCardComponent} from './unexpected-summary-card.component';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {JourneyService} from '../../../services/journey/journey.service';

describe('UnExpectedExpensesSummaryCardComponent', () => {
  let component: UnExpectedExpensesSummaryCardComponent;
  let fixture: ComponentFixture<UnExpectedExpensesSummaryCardComponent>;
  let journeyServiceSpy;
  const unexpectedGoalContent = {
    description: 'Unexpected Expenses Contribution Goal',
    imageUrl: 'assets/icon/progressBarBackground.svg',
    label: 'Current / Your Saving Goal',
    rows: [
      {
        answerId: 'targetMonthlyContribution',
        label: 'Target monthly contributions for the next 3 years',
        type: 'textField',
        answer: '$2.14',
      },
    ],
    marginBottom: '0px',
    labelFontSize: '14px',
    type: 'dollar',
    value: 0,
    maxValue: 76,
  };
  let unExpectedServiceSpy;
  let valueChange;
  let mxServiceSpy;

  beforeEach(
    waitForAsync(() => {
      mxServiceSpy = jasmine.createSpyObj('MXService', ['getMXAccountData']);
      unExpectedServiceSpy = jasmine.createSpyObj('UnExpectedService', [
        'fetchUnexpectedGoalContent',
      ]);
      valueChange = of();
      unExpectedServiceSpy.valueChange = valueChange;
      unExpectedServiceSpy.fetchUnexpectedGoalContent.and.returnValue(
        Promise.resolve(unexpectedGoalContent)
      );
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', ['openModal']);
      TestBed.configureTestingModule({
        declarations: [UnExpectedExpensesSummaryCardComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: UnExpectedService, useValue: unExpectedServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(UnExpectedExpensesSummaryCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should add the content to the summaryCard element', async () => {
      await component.ngOnInit();
      expect(
        unExpectedServiceSpy.fetchUnexpectedGoalContent
      ).toHaveBeenCalled();
    });

    describe('ngOnInit', () => {
      let subscriptionSpy;
      beforeEach(() => {
        unExpectedServiceSpy.currentSavings = 10;
        unExpectedServiceSpy.emergencySavingGoal = '$60';
        component.summaryCard.value = undefined;
        component.summaryCard.maxValue = undefined;
        subscriptionSpy = jasmine.createSpyObj('subscription', ['']);
        spyOn(valueChange, 'subscribe').and.callFake(f => {
          f();
          return subscriptionSpy;
        });
        spyOn(component['subscription'], 'add');
      });

      it('should subscribe to value change and set the value and maxValue', async () => {
        await component.ngOnInit();
        expect(component['subscription'].add).toHaveBeenCalledWith(
          subscriptionSpy
        );
        expect(valueChange.subscribe).toHaveBeenCalled();
        expect(component.summaryCard.maxValue).toEqual(60.0);
        expect(component.summaryCard.value).toEqual(10);
      });

      it('when accountLinked is true', async () => {
        spyOn(component, 'fetchAccountInfo');
        unExpectedServiceSpy.accountLinkedId =
          'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9';
        unExpectedServiceSpy.accountLinked = true;
        await component.ngOnInit();
        expect(component.fetchAccountInfo).toHaveBeenCalledWith(
          'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9'
        );
        expect(component.accountLinked).toEqual(true);
      });
    });
  });

  describe('fetchAccountInfo', () => {
    let observable;
    let subscription;
    const mockMXAccount = {
      account_number: '4684406678',
      account_type_name: 'Checking',
      available_balance: '1000.0',
      balance: '1000.0',
      currency_code: 'USD',
      guid: 'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9',
      name: 'MX Bank Checking',
      routing_number: '731775673',
      updated_at: '2022-05-31T12:54:19+00:00',
      user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
      institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
      small_logo_url:
        'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
      medium_logo_url:
        'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_100x100.png',
      institution_name: 'MX Bank (Oauth) 4',
    };
    beforeEach(() => {
      subscription = new Subscription();
      observable = of(mockMXAccount);
      spyOn(observable, 'subscribe').and.callFake(f => {
        f(mockMXAccount);
        return subscription;
      });
      spyOn(component['subscription'], 'add');
      mxServiceSpy.getMXAccountData.and.returnValue(observable);
    });
    it('should set accountlogoUrl and accountName', () => {
      component.fetchAccountInfo('ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9');
      expect(mxServiceSpy.getMXAccountData).toHaveBeenCalledWith(
        'ACT-d55b73c3-37e8-4621-afd1-0303fc4a80a9'
      );
      expect(component.accountlogoUrl).toEqual(mockMXAccount.small_logo_url);
      expect(component.accountName).toEqual(mockMXAccount.name);
      expect(component['subscription'].add).toHaveBeenCalledWith(subscription);
    });
  });

  describe('openDialog', () => {
    it('should show revisit journey modal', async () => {
      await component.openDialog();
      expect(journeyServiceSpy.openModal).toHaveBeenCalledWith(
        {element: {id: 'revisit-journey-modal'}},
        false
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscription', () => {
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
