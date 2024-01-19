import {Injectable} from '@angular/core';
import {endPoints} from '@shared-lib/services/account/constants/endpoints';
import {omCalculator, AccountTypes} from 'om-js-calc/src/index';
import {NonFeModelBase} from 'voya-orange-money/build/orangemoneyui/nonFEModelBase.js';
import {FeModelBase} from 'voya-orange-money/build/orangemoneyui/feModelBase.js';
import {OMEligibleData} from '@shared-lib/services/account/models/omeligible.model';
import {
  ContributionSourcePayload,
  OMStatus,
  OrangeData,
  OrangeMoneyEstimates,
  RetirementAgeSaveResp,
  SalarySaveResp,
} from '@shared-lib/services/account/models/orange-money.model';
import {from, Observable, ReplaySubject, Subscription} from 'rxjs';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {AccessService} from '@shared-lib/services/access/access.service';
import {OmEmployerMatch} from '@shared-lib/services/account/models/om-employer-match.model';

@Injectable({
  providedIn: 'root',
})
export class OrangeMoneyService {
  income: number;
  shortfallVal: number;
  omEligibleData: OMEligibleData;
  private orangeDataSubject: ReplaySubject<OrangeData> = null;
  private subscription: Subscription = new Subscription();
  private omData: Observable<OrangeData> = null;
  private omEmployerMatch: Observable<OmEmployerMatch> = null;
  nonFEModelBase: any;
  feModelBase: any;
  ssAdditionalBenefits: number;
  endpoints;
  userID: string;

  constructor(
    private baseService: BaseService,
    private utilityService: SharedUtilityService,
    private accountService: AccountService,
    private accessService: AccessService
  ) {
    this.endpoints = this.utilityService.appendBaseUrlToEndpoints(endPoints);
    this.nonFEModelBase = new NonFeModelBase();
    this.feModelBase = new FeModelBase();
    this.orangeDataSubject = new ReplaySubject(1);
  }

  async getOMEligibility(): Promise<OMEligibleData> {
    if (this.omEligibleData === undefined) {
      this.omEligibleData = await this.baseService.get(
        this.endpoints.omEligibility
      );
    }
    return this.omEligibleData;
  }

  getOrangeData(refresh = false): Observable<OrangeData> {
    if (this.omData == null || refresh) {
      const url = from(this.appendQueryParams(this.endpoints.getrrinfo));
      url.subscribe(res => {
        this.omData = from(this.baseService.get(res));
        const subscription = this.omData.subscribe(result => {
          this.orangeDataSubject.next(result);
        });
        this.subscription.add(subscription);
      });
    }
    return this.orangeDataSubject;
  }

  setOrangeData(omData) {
    this.orangeDataSubject.next(omData);
  }

  async saveRetiremnetAgeFE(age: number): Promise<RetirementAgeSaveResp> {
    const planId: string = this.accountService.getAccount()?.planId
      ? this.accountService.getAccount().planId
      : (await this.accessService.checkMyvoyageAccess())?.currentPlan.planId;
    return this.baseService.post(this.endpoints.saveRetirementAgeFE, {
      contributionUpdate: {
        planId: planId,
        crc: true,
        retirementAge: age,
        regularUnit: 'PERCENT',
        sources: [],
        saveRetirementAge: true,
      },
    });
  }

  saveRetirementAgeNonFE(
    age: number,
    orangeData: OrangeData
  ): Promise<RetirementAgeSaveResp> {
    const sources: ContributionSourcePayload[] = [];
    orangeData.orangeData.participantDefinedContributionAccounts[0].planInfo.sources.forEach(
      source => {
        sources.push({
          amount: source.contribution,
          id: source.id,
          type: source.type,
        });
      }
    );

    const payload = {
      contributionUpdate: {
        planId: this.accountService.getAccount()?.planId
          ? this.accountService.getAccount().planId
          : orangeData.orangeData.participantDefinedContributionAccounts[0]
              .planInfo.planId,
        crc:
          orangeData.orangeData.participantDefinedContributionAccounts[0]
            .planInfo.crcAllowed,
        retirementAge: age,
        investmentRateOfReturn:
          orangeData.orangeData.participantData.investmentRateOfReturn,
        regularUnit:
          orangeData.orangeData.participantDefinedContributionAccounts[0]
            .contributionData.regularContributionUnit,
        catchupUnit:
          orangeData.orangeData.participantDefinedContributionAccounts[0]
            .planInfo.catchupContributionType,
        sources: sources,
      },
    };

    return this.baseService.post(
      this.endpoints.saveRetirementAgeNonFE,
      payload
    );
  }

  saveSalaryFE(
    salary: number,
    growthRate: number,
    desiredGoal: number,
    minimumGoal: number
  ): Promise<SalarySaveResp> {
    return this.baseService.post(this.endpoints.saveSalaryFE, {
      contributionUpdate: {},
      aboutMeData: {
        salary: salary,
        growthRate: growthRate,
        desiredGoal: desiredGoal * 12,
        minimumGoal: minimumGoal * 12,
      },
    });
  }

  saveSalaryNonFE(
    salary: number,
    dob: string,
    omData: OrangeData
  ): Promise<SalarySaveResp> {
    return this.baseService.post(this.endpoints.saveSalaryNonFE, {
      pptProfile: {
        currentAnnualSalary: salary,
        dob: dob,
        plans: [
          {
            planId: this.accountService.getAccount()?.planId
              ? this.accountService.getAccount().planId
              : omData.orangeData.participantDefinedContributionAccounts[0]
                  .planInfo.planId,
          },
        ],
      },
    });
  }

  getOrangeMoneyStatus(omData: OrangeData): OMStatus {
    if (
      !omData ||
      omData.errorCode === 'system-unavailable' ||
      omData.errorCode === 'insufficient-data'
    ) {
      return OMStatus.SERVICE_DOWN;
    }
    if (omData.madLibData || omData.errorCode === 'opt-out') {
      return OMStatus.MADLIB_OM;
    }

    if (omData.orangeData) {
      return OMStatus.ORANGE_DATA;
    }
    if (omData.feForecastData) {
      if (omData.feForecastData.feForecast.errorCode) {
        return OMStatus.MADLIB_FE;
      } else {
        return OMStatus.FE_DATA;
      }
    }
    return OMStatus.UNKNOWN;
  }

  // *************** getrrinfo Call ***************

  async getEstimates(omData): Promise<OrangeMoneyEstimates> {
    const status = this.getOrangeMoneyStatus(omData);
    switch (status) {
      case OMStatus.ORANGE_DATA:
        return this.getNonFEEstimates(omData);
      case OMStatus.FE_DATA:
        return this.getFEData(omData);
      case OMStatus.MADLIB_OM:
      case OMStatus.MADLIB_FE:
      case OMStatus.SERVICE_DOWN:
      case OMStatus.UNKNOWN:
        return null;
    }
  }

  async getpension() {
    return this.baseService.get(
      await this.appendQueryParams(this.endpoints.getpension)
    );
  }

  async getsrbenefits() {
    return this.baseService.get(
      await this.appendQueryParams(this.endpoints.getsrbenefits)
    );
  }

  async getssbenefits() {
    return this.baseService.get(
      await this.appendQueryParams(this.endpoints.getssbenefits)
    );
  }

  async appendQueryParams(url: string): Promise<string> {
    const sessionID = localStorage.getItem('sessionId');
    const clientId = (await this.accessService.checkMyvoyageAccess())?.clientId;
    if (sessionID !== null && clientId !== null) {
      return url
        .replace('{clientId}', 'clientId=' + clientId)
        .replace('{sessionId}', '&s=' + sessionID);
    } else if (sessionID !== null && clientId == null) {
      return url
        .replace('{clientId}', '')
        .replace('{sessionId}', 's=' + sessionID);
    } else if (sessionID == null && clientId !== null) {
      return url
        .replace('{clientId}', 'clientId=' + clientId)
        .replace('{sessionId}', '');
    } else {
      return url.split('?')[0];
    }
  }

  getFEData(data: OrangeData): OrangeMoneyEstimates {
    const monthly = data.feForecastData.feForecast.totalIncome;
    const goal = data.feForecastData.feForecast.goal;

    return {
      estimatedMonthlyIncome: monthly,
      estimatedMonthlyGoal: goal,
      difference: goal - monthly,
      retirementAge: data.feForecastData.participantData.selectedRetirementAge,
      currSalary: data.feForecastData.participantData.salary.amount,
    };
  }

  async getNonFEEstimates(omData: OrangeData): Promise<OrangeMoneyEstimates> {
    //SS Benefits Call
    const ssBenefits = await this.getssbenefits();
    //Pension Call
    const pension: any = await this.getpension();
    if (pension.errorMessage) {
      return undefined;
    }
    //checking if it is SR Plan
    const pensionViewType = pension.pensionView.pensionViewFlag;
    let srBenefitsResponse;
    if (
      pensionViewType === 'CalcBenefit' &&
      pension.pensionView.srData.pensionCalMethod === 'C'
    ) {
      srBenefitsResponse = await this.getsrbenefits();
      if (!srBenefitsResponse || srBenefitsResponse.errorMessage) {
        return undefined;
      }
    }
    this.nonFEModelBase.initializeData(
      omData,
      ssBenefits,
      pension,
      srBenefitsResponse,
      undefined,
      'portfolio',
      false,
      AccountTypes,
      omCalculator
    );

    const estimates = this.createDollarGraphHeaderObject(
      this.nonFEModelBase.nonFeLandingObject
    );

    return {
      ...estimates,
      retirementAge: omData.orangeData.participantData.retirementAge,
      currSalary: omData.orangeData.participantData.currentAnnualSalary,
    };
  }

  createDollarGraphHeaderObject(nonFeLandingObject) {
    this.ssAdditionalBenefits = this.getSSAddlBenefits(nonFeLandingObject);
    this.income = this.getIncome(nonFeLandingObject);
    this.shortfallVal = this.getDifference(nonFeLandingObject);
    return {
      estimatedMonthlyIncome: Math.round(this.income),
      estimatedMonthlyGoal: Math.round(
        nonFeLandingObject.calcResponse.getMonthlySalaryReplacementRequirement()
      ),
      difference: Math.round(this.shortfallVal),
    };
  }

  getSSAddlBenefits(nonFeLandingObject) {
    const ssStartAge = nonFeLandingObject.calculatedSSData.ssStartValue;
    const ssRetireAge =
      nonFeLandingObject.calculatedSSData.ssStartRetireAgeValue;
    if (ssRetireAge < ssStartAge) {
      return 0;
    } else if (ssRetireAge > ssStartAge) {
      return nonFeLandingObject.ssAdditionalBenefits;
    } else if (ssRetireAge === ssStartAge) {
      return nonFeLandingObject.ssAdditionalBenefits;
    }
  }

  getDifference(nonFeLandingObject) {
    return (
      nonFeLandingObject.calcResponse.getMonthlySalaryReplacementRequirement() -
      this.income
    );
  }

  getIncome(nonFeLandingObject) {
    const ssStartAge = nonFeLandingObject.ssStartAge;
    const ssRetireAge = nonFeLandingObject.ssRetireAge;
    const incomeAtSS =
      nonFeLandingObject.calculatedSSData.ssIncomeSS +
      nonFeLandingObject.calculatedSSData.ssBenefitSS +
      this.ssAdditionalBenefits;
    const incomeAtRA =
      nonFeLandingObject.calculatedSSData.ssIncomeRA +
      nonFeLandingObject.calculatedSSData.ssBenefitRA +
      this.ssAdditionalBenefits;
    if (ssRetireAge < ssStartAge) {
      return incomeAtRA;
    } else if (ssRetireAge > ssStartAge) {
      return incomeAtRA;
    } else if (ssRetireAge === ssStartAge) {
      return incomeAtSS;
    }
  }

  updateOrangeMoneyOptOut(): Promise<OrangeData> {
    return this.baseService.post(this.endpoints.updateOptOut, {optOut: false});
  }

  async postMadlibData(
    dob: string,
    salary: number,
    feeling: string
  ): Promise<OrangeData> {
    return this.baseService.post(this.endpoints.saveMadlib, {
      dob: dob,
      salary: salary,
      feeling: feeling,
    });
  }

  getSalary(): Promise<number> {
    return new Promise(resolve => {
      this.getOrangeData().subscribe(async omData => {
        const {currSalary} = await this.getEstimates(omData);
        resolve(currSalary);
      });
    });
  }

  getOmEmployerMatch(
    clientId: string,
    planId: string,
    sessionId: string
  ): Observable<OmEmployerMatch> {
    if (!this.omEmployerMatch) {
      const url = this.endpoints.getOmEmployerMatch
        .replace('{clientId}', clientId)
        .replace('{planId}', planId)
        .replace('{sessionId}', sessionId);

      this.omEmployerMatch = from(this.baseService.get(url));
    }
    return this.omEmployerMatch;
  }
}
