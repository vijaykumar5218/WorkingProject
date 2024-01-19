import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MyBenefitHubService} from './mybenefithub.service';
import {endPoints} from './constants/endpoints';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {of, Subscription} from 'rxjs';

describe('MyBenefitHubService', () => {
  let service: MyBenefitHubService;
  let sharedUtilityServiceSpy;
  let baseServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj(
        'sharedUtilityServiceSpy',
        ['appendBaseUrlToEndpoints']
      );
      baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['get']);
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule],
        providers: [
          MyBenefitHubService,
          {provide: BaseService, useValue: baseServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      });
      service = TestBed.inject(MyBenefitHubService);
      service['subscription'] = jasmine.createSpyObj('Subscription', [
        'add',
        'unsubscribe',
      ]);
      service.endPoints = endPoints;
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBillingAndPaymentDetails', () => {
    const billingAndPayment = [
      {
        financialAccountId: '932722',
        balance: '166.70',
        totalSuspense: '0',
        billingConfigs: [
          {
            billingServiceTechId: '697355',
            paymentFormat: 'Manual',
            nextBillingGenerationDate: '2024-01-04 00:00:00.0',
            nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
            achDay: '',
            achNextDay: '',
            lapseDate: '',
            status: 'Active - In-Force',
            effectiveDate: '2020-11-01 00:00:00.0',
            terminationDate: '',
            invoiceFrequency: 'Quarterly',
            bankAccountTechId: '',
            bankName: '',
            accountType: '',
            routingNumber: '',
            bankAccountNumber: '',
            bankAccountName: '',
            achEffectiveDate: '',
            surrenderStatus: '',
          },
        ],
      },
    ];
    beforeEach(() => {
      baseServiceSpy.get.and.returnValue(Promise.resolve(billingAndPayment));
    });

    it('should call get to get the data if billingdetails$ is undefined', done => {
      service['billingdetails$'] = undefined;
      service.getBillingAndPaymentDetails().subscribe(data => {
        expect(baseServiceSpy.get).toHaveBeenCalled();
        expect(data).toEqual(billingAndPayment);
        done();
      });
    });

    describe('if refresh be true', () => {
      let observable;
      let subscription;
      beforeEach(() => {
        subscription = new Subscription();
        observable = of(billingAndPayment);
        spyOn(observable, 'subscribe').and.callFake(f => {
          f(billingAndPayment);
          return subscription;
        });
      });

      it('should call get to get the data', done => {
        service['billingdetails$'] = observable;
        service.getBillingAndPaymentDetails(true).subscribe(data => {
          expect(baseServiceSpy.get).toHaveBeenCalled();
          expect(data).toEqual(billingAndPayment);
          expect(service['subscription'].add).toHaveBeenCalled();
          done();
        });
      });
    });

    it('should not call get to get the data if billingdetails$ is defined and refresh is false', () => {
      service['billingdetails$'] = of(billingAndPayment);
      const billingdetailsSubjectSpy = jasmine.createSpyObj(
        'billingdetailsSubjectSpy',
        ['']
      );
      service['billingdetailsSubject'] = billingdetailsSubjectSpy;
      const result = service.getBillingAndPaymentDetails();
      expect(baseServiceSpy.get).not.toHaveBeenCalled();
      expect(result).toEqual(billingdetailsSubjectSpy);
    });
  });

  describe('fetchBillingAccounts', () => {
    const billingAndPayment = [
      {
        financialAccountId: '932722',
        balance: '166',
        totalSuspense: '0',
        billingConfigs: [
          {
            billingServiceTechId: '697355',
            paymentFormat: 'ACH Initiate',
            nextBillingGenerationDate: '2024-01-04 00:00:00.0',
            nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
            achDay: '',
            achNextDay: '',
            lapseDate: '',
            status: 'Active - In-Forcexxx',
            effectiveDate: '2020-11-01 00:00:00.0',
            terminationDate: '',
            invoiceFrequency: 'Quarterly',
            bankAccountTechId: '',
            bankName: '',
            accountType: '',
            routingNumber: '',
            bankAccountNumber: '',
            bankAccountName: '',
            achEffectiveDate: '',
            surrenderStatus: '',
            downstreamProcessingStatus: null,
          },
          {
            billingServiceTechId: '697356',
            paymentFormat: 'ACH Initiate',
            nextBillingGenerationDate: '2024-01-04 00:00:00.0',
            nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
            achDay: '',
            achNextDay: '',
            lapseDate: '',
            status: 'Active - In-Force',
            effectiveDate: '2020-11-01 00:00:00.0',
            terminationDate: '',
            invoiceFrequency: 'Quarterly',
            bankAccountTechId: '',
            bankName: '',
            accountType: '',
            routingNumber: '',
            bankAccountNumber: '',
            bankAccountName: '',
            achEffectiveDate: '',
            surrenderStatus: '',
            downstreamProcessingStatus: null,
          },
        ],
      },
    ];
    beforeEach(() => {
      service['findCurrentBillingConfig'] = jasmine
        .createSpy()
        .and.returnValue(billingAndPayment[0].billingConfigs[1]);
    });
    it('when length of billingAndPayments is greater than zero', () => {
      spyOn(service, 'getBillingAndPaymentDetails').and.returnValue(
        of(billingAndPayment)
      );
      service.fetchBillingAccounts().subscribe(data => {
        expect(data).toEqual({
          billingAccounts: [
            {
              financialAccountId: billingAndPayment[0].financialAccountId,
              balance: parseInt(billingAndPayment[0].balance),
              billingConfigs: billingAndPayment[0].billingConfigs[1],
              totalSuspense: billingAndPayment[0].totalSuspense,
            },
          ],
        });
      });
    });
    it('when length of billingAndPayments is greater than zero', () => {
      spyOn(service, 'getBillingAndPaymentDetails').and.returnValue(of(null));
      service.fetchBillingAccounts().subscribe(data => {
        expect(data).toEqual({
          billingAccounts: [],
        });
      });
    });
  });

  describe('findCurrentBillingConfig', () => {
    it("when current billing config would have a status of 'Active In-force' and no termination date", () => {
      const result = service['findCurrentBillingConfig']([
        {
          billingServiceTechId: '697355',
          paymentFormat: 'ACH Initiate',
          nextBillingGenerationDate: '2024-01-04 00:00:00.0',
          nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
          achDay: '',
          achNextDay: '',
          lapseDate: '',
          status: 'Active - In-Forcexxx',
          effectiveDate: '2020-11-01 00:00:00.0',
          terminationDate: '',
          invoiceFrequency: 'Quarterly',
          bankAccountTechId: '',
          bankName: '',
          accountType: '',
          routingNumber: '',
          bankAccountNumber: '',
          bankAccountName: '',
          achEffectiveDate: '',
          surrenderStatus: '',
          downstreamProcessingStatus: null,
        },
        {
          billingServiceTechId: '697356',
          paymentFormat: 'ACH Initiate',
          nextBillingGenerationDate: '2024-01-04 00:00:00.0',
          nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
          achDay: '',
          achNextDay: '',
          lapseDate: '',
          status: 'Active - In-Force',
          effectiveDate: '2020-11-01 00:00:00.0',
          terminationDate: '',
          invoiceFrequency: 'Quarterly',
          bankAccountTechId: '',
          bankName: '',
          accountType: '',
          routingNumber: '',
          bankAccountNumber: '',
          bankAccountName: '',
          achEffectiveDate: '',
          surrenderStatus: '',
          downstreamProcessingStatus: null,
        },
      ]);
      expect(result).toEqual({
        billingServiceTechId: '697356',
        paymentFormat: 'ACH Initiate',
        nextBillingGenerationDate: '2024-01-04 00:00:00.0',
        nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
        achDay: '',
        achNextDay: '',
        lapseDate: '',
        status: 'Active - In-Force',
        effectiveDate: '2020-11-01 00:00:00.0',
        terminationDate: '',
        invoiceFrequency: 'Quarterly',
        bankAccountTechId: '',
        bankName: '',
        accountType: '',
        routingNumber: '',
        bankAccountNumber: '',
        bankAccountName: '',
        achEffectiveDate: '',
        surrenderStatus: '',
        downstreamProcessingStatus: null,
      });
    });
    it("when current billing config would not have a status of 'Active In-force' and no termination date", () => {
      const result = service['findCurrentBillingConfig']([
        {
          billingServiceTechId: '697355',
          paymentFormat: 'ACH Initiate',
          nextBillingGenerationDate: '2024-01-04 00:00:00.0',
          nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
          achDay: '',
          achNextDay: '',
          lapseDate: '',
          status: 'Active - In-Forcexxx',
          effectiveDate: '2020-11-01 00:00:00.0',
          terminationDate: '',
          invoiceFrequency: 'Quarterly',
          bankAccountTechId: '',
          bankName: '',
          accountType: '',
          routingNumber: '',
          bankAccountNumber: '',
          bankAccountName: '',
          achEffectiveDate: '',
          surrenderStatus: '',
          downstreamProcessingStatus: null,
        },
      ]);
      expect(result).toEqual({
        billingServiceTechId: '697355',
        paymentFormat: 'ACH Initiate',
        nextBillingGenerationDate: '2024-01-04 00:00:00.0',
        nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
        achDay: '',
        achNextDay: '',
        lapseDate: '',
        status: 'Active - In-Forcexxx',
        effectiveDate: '2020-11-01 00:00:00.0',
        terminationDate: '',
        invoiceFrequency: 'Quarterly',
        bankAccountTechId: '',
        bankName: '',
        accountType: '',
        routingNumber: '',
        bankAccountNumber: '',
        bankAccountName: '',
        achEffectiveDate: '',
        surrenderStatus: '',
        downstreamProcessingStatus: null,
      });
    });
  });

  describe('allAccountsHaveNonforfeitureOptionStatus', () => {
    const billingAndPayment = [
      {
        financialAccountId: '932722',
        balance: '166.70',
        totalSuspense: '0',
        billingConfigs: [
          {
            billingServiceTechId: '697356',
            paymentFormat: 'ACH Initiate',
            nextBillingGenerationDate: '2024-01-04 00:00:00.0',
            nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
            achDay: '',
            achNextDay: '',
            lapseDate: '',
            status: 'Active - In-Force',
            effectiveDate: '2020-11-01 00:00:00.0',
            terminationDate: '',
            invoiceFrequency: 'Quarterly',
            bankAccountTechId: '',
            bankName: '',
            accountType: '',
            routingNumber: '',
            bankAccountNumber: '',
            bankAccountName: '',
            achEffectiveDate: '',
            surrenderStatus: '',
            downstreamProcessingStatus: null,
          },
        ],
      },
      {
        financialAccountId: '937834',
        balance: '20',
        totalSuspense: '0',
        billingConfigs: [
          {
            billingServiceTechId: '702009',
            paymentFormat: 'ACH Initiate',
            nextBillingGenerationDate: '2024-01-04 00:00:00.0',
            nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
            achDay: '',
            achNextDay: '',
            lapseDate: '',
            status: 'Active - In-Force',
            effectiveDate: '2020-11-01 00:00:00.0',
            terminationDate: '2024-02-01 00:00:00.0',
            invoiceFrequency: 'Quarterly',
            bankAccountTechId: '',
            bankName: '',
            accountType: '',
            routingNumber: '',
            bankAccountNumber: '',
            bankAccountName: '',
            achEffectiveDate: '',
            surrenderStatus: 'Reduced Paid Up (NFO)',
            downstreamProcessingStatus: null,
          },
        ],
      },
    ];
    it('when length of billingAndPayments is greater than zero', () => {
      spyOn(service, 'fetchBillingAccounts').and.returnValue(
        of({
          billingAccounts: [
            {
              financialAccountId: billingAndPayment[0].financialAccountId,
              balance: parseInt(billingAndPayment[0].balance),
              billingConfigs: billingAndPayment[0].billingConfigs[0],
              totalSuspense: billingAndPayment[0].totalSuspense,
            },
            {
              financialAccountId: billingAndPayment[1].financialAccountId,
              balance: parseInt(billingAndPayment[1].balance),
              billingConfigs: billingAndPayment[1].billingConfigs[0],
              totalSuspense: billingAndPayment[1].totalSuspense,
            },
          ],
        })
      );
      service.allAccountsHaveNonforfeitureOptionStatus().subscribe(data => {
        expect(data).toEqual(true);
      });
    });
    it('when length of billingAndPayments is  zero', () => {
      spyOn(service, 'fetchBillingAccounts').and.returnValue(
        of({
          billingAccounts: [],
        })
      );
      service.allAccountsHaveNonforfeitureOptionStatus().subscribe(data => {
        expect(data).toEqual(false);
      });
    });
  });

  describe('hasNonAutoPay', () => {
    it('should return value', () => {
      const result = service.hasNonAutoPay({
        billingAccounts: [
          {
            financialAccountId: '932722',
            balance: 166,
            billingConfigs: {
              billingServiceTechId: '697356',
              paymentFormat: 'ACH Initiate',
              nextBillingGenerationDate: '2024-01-04 00:00:00.0',
              nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
              achDay: '',
              achNextDay: '',
              lapseDate: '',
              status: 'Active - In-Force',
              effectiveDate: '2020-11-01 00:00:00.0',
              terminationDate: '',
              invoiceFrequency: 'Quarterly',
              bankAccountTechId: '',
              bankName: '',
              accountType: '',
              routingNumber: '',
              bankAccountNumber: '',
              bankAccountName: '',
              achEffectiveDate: '',
              surrenderStatus: '',
              downstreamProcessingStatus: null,
            },
            totalSuspense: '0',
          },
          {
            financialAccountId: '937834',
            balance: 20,
            billingConfigs: {
              billingServiceTechId: '702009',
              paymentFormat: 'ACH InitiateYY',
              nextBillingGenerationDate: '2024-01-04 00:00:00.0',
              nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
              achDay: '',
              achNextDay: '',
              lapseDate: '',
              status: 'Active - In-Force',
              effectiveDate: '2020-11-01 00:00:00.0',
              terminationDate: '2024-02-01 00:00:00.0',
              invoiceFrequency: 'Quarterly',
              bankAccountTechId: '',
              bankName: '',
              accountType: '',
              routingNumber: '',
              bankAccountNumber: '',
              bankAccountName: '',
              achEffectiveDate: '',
              surrenderStatus: '',
              downstreamProcessingStatus: null,
            },
            totalSuspense: '0',
          },
        ],
      });
      expect(result).toEqual(true);
    });
  });

  describe('setPaymentDueDetails', () => {
    it('should return value', () => {
      const result = service.setPaymentDueDetails({
        billingAccounts: [
          {
            financialAccountId: '932722',
            balance: 166,
            billingConfigs: {
              billingServiceTechId: '697356',
              paymentFormat: 'ACH Initiate',
              nextBillingGenerationDate: '2024-01-04 00:00:00.0',
              nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
              achDay: '',
              achNextDay: '',
              lapseDate: '',
              status: 'Active - In-Force',
              effectiveDate: '2020-11-01 00:00:00.0',
              terminationDate: '',
              invoiceFrequency: 'Quarterly',
              bankAccountTechId: '',
              bankName: '',
              accountType: '',
              routingNumber: '',
              bankAccountNumber: '',
              bankAccountName: '',
              achEffectiveDate: '',
              surrenderStatus: '',
              downstreamProcessingStatus: null,
            },
            totalSuspense: '0',
          },
          {
            financialAccountId: '937834',
            balance: 0,
            billingConfigs: {
              billingServiceTechId: '702009',
              paymentFormat: 'ACH InitiateYY',
              nextBillingGenerationDate: '2024-01-04 00:00:00.0',
              nextBillingPeriodStartDate: '2024-02-01 00:00:00.0',
              achDay: '',
              achNextDay: '',
              lapseDate: '',
              status: 'Active - In-Force',
              effectiveDate: '2020-11-01 00:00:00.0',
              terminationDate: '2024-02-01 00:00:00.0',
              invoiceFrequency: 'Quarterly',
              bankAccountTechId: '',
              bankName: '',
              accountType: '',
              routingNumber: '',
              bankAccountNumber: '',
              bankAccountName: '',
              achEffectiveDate: '',
              surrenderStatus: '',
              downstreamProcessingStatus: null,
            },
            totalSuspense: '0',
          },
        ],
      });
      expect(result).toEqual({
        totalPaymentDue: 166,
        nPaymentsDue: 1,
      });
    });
  });
});
