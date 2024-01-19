import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AccountRadioButtonComponent} from './account-radio-button.component';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {of, Subscription} from 'rxjs';
import {MXAccount} from '@shared-lib/services/mx-service/models/mx.model';

describe('AccountRadioButtonComponent', () => {
  let component: AccountRadioButtonComponent;
  let fixture: ComponentFixture<AccountRadioButtonComponent>;
  let UnExpectedServiceSpy;
  let serviceSpy;
  let subscriptionSpy;
  let journeyServiceSpy;
  let accountObservable;
  let accountSubscription;

  const accountData: MXAccount[] = [
    {
      account_type_name: 'Savings',
      account_number: '1234567890',
      radioButtonIconName: 'radio-button-off',
      institution_name: 'mx account',
      medium_logo_url: 'abc.svg',
      guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
      name: 'Savings_Account',
      available_balance: '100',
      currency_code: 'USD',
      balance: '100',
      routing_number: '731775673',
      updated_at: '2022-05-16T10:42:10+00:00',
      user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d12',
      institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0746c',
      small_logo_url:
        'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-68e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
    },
    {
      account_type_name: 'Cash',
      account_number: '2345678901',
      radioButtonIconName: 'radio-button-off',
      institution_name: 'mx account',
      medium_logo_url: 'abc.svg',
      guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
      name: 'Cash_Account',
      available_balance: '1005',
      currency_code: 'USD',
      balance: '1005',
      routing_number: '731775672',
      updated_at: '2022-05-16T10:42:10+00:25',
      user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b03d35',
      institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-416897f0723c',
      small_logo_url:
        'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-38e96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
    },
    {
      account_type_name: 'Checking',
      account_number: '3456789012',
      radioButtonIconName: '',
      institution_name: 'mx account',
      medium_logo_url: 'abc.svg',
      guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
      name: 'Checking_Account',
      available_balance: '10087',
      currency_code: 'USD',
      balance: '10087',
      routing_number: '731775671',
      updated_at: '2022-05-16T10:42:10+00:12',
      user_guid: 'USR-cf7c18a3-5552-4f78-82fc-7013a3b04d35',
      institution_guid: 'INS-68e96dd6-eabd-42d3-9f05-415897f0723c',
      small_logo_url:
        'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-38f96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
    },
    {
      account_type_name: 'Savings',
      account_number: '1234567890',
      radioButtonIconName: 'radio-button-on',
      institution_name: 'mx account',
      medium_logo_url: 'abc.svg',
      guid: 'ACT-8fa39e08-8981-4c4f-8910-177e53836bd1',
      name: 'Savings_Account_2',
      available_balance: '25',
      currency_code: 'USD',
      balance: '25',
      routing_number: '731772671',
      updated_at: '2022-05-17T10:42:10+00:12',
      user_guid: 'USR-cf7c18a3-5352-4f78-82fc-7013a3b04d35',
      institution_guid: 'INS-68e16dd6-eabd-42d3-9f05-415897f0723c',
      small_logo_url:
        'https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/50x50/INS-38c96dd6-eabd-42d3-9f05-416897f0746c_50x50.png',
    },
  ];

  beforeEach(
    waitForAsync(() => {
      UnExpectedServiceSpy = jasmine.createSpyObj('UnExpectedService', [
        'getMXAccountData',
      ]);
      UnExpectedServiceSpy.getMXAccountData.and.returnValue({
        subscribe: () => undefined,
      });
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
      ]);
      journeyServiceSpy.getCurrentJourney.and.returnValue({journeyID: 7});
      serviceSpy = jasmine.createSpyObj('service', ['getMXAccountData']);
      accountObservable = of({accounts: accountData});
      accountSubscription = new Subscription();
      spyOn(accountObservable, 'subscribe').and.callFake(f => {
        f({accounts: accountData});
        return accountSubscription;
      });
      serviceSpy.getMXAccountData.and.returnValue(accountObservable);
      journeyServiceSpy.journeyServiceMap = {
        7: serviceSpy,
      };
      TestBed.configureTestingModule({
        declarations: [AccountRadioButtonComponent],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountRadioButtonComponent);
      component = fixture.componentInstance;
      subscriptionSpy = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
        'add',
      ]);
      component['subscription'] = subscriptionSpy;
      component.element = {
        answerId: 'linkExistingAccount',
        bold: true,
        id: 'input',
        idSuffix: '025',
        isRequired: true,
        radioLabel:
          'Select an account you would like to use as your college savings account',
        type: 'accountRadioButton',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the value of accountData', () => {
      component.ngOnInit();
      expect(component.accountData).toEqual(accountData);
      expect(serviceSpy.getMXAccountData).toHaveBeenCalled();
      expect(component['subscription'].add).toHaveBeenCalledWith(
        accountSubscription
      );
    });
  });

  describe('updateRadioValue', () => {
    beforeEach(() => {
      spyOn(component.valueChange, 'emit');
    });

    it('should set the value on the step if step value is empty string', () => {
      component['value'] = '';
      component.updateRadioValue('');
      expect(component['value']).toEqual('');
    });

    it('should set the value on the step if step value is not empty string', () => {
      component['value'] = 'input1';
      component.updateRadioValue('input1');
      expect(component['value']).toEqual('input1');
    });
  });

  describe('suppressAccountNumber', () => {
    it('should return the account number with XXXXXX[last 4 digit]', () => {
      const res = component.suppressAccountNumber('1234567890');
      expect(res).toEqual('XXXXXX7890');
    });
  });

  describe('emitData', () => {
    beforeEach(() => {
      spyOn(component, 'updateRadioValue');
    });
    it('when radioButtonIconName is radio-button-off will be radio-button-off', () => {
      component.accountData = accountData;
      component.emitData('ACT-8fa39e08-8981-4c4f-8910-177e53836bd1');
      expect(component.accountData[3].radioButtonIconName).toEqual(
        'radio-button-off'
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should call unsubscribe', () => {
      component.ngOnDestroy();
      expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
    });
  });
});
