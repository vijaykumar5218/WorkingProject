import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {BaseService} from '../../../../../../../services/base/base-factory-provider';
import {CollegeService} from '../../../../../../../services/journey/collegeService/college.service';
import {JourneyService} from '../../../../../../../services/journey/journey.service';
import {JourneyUtilityService} from '../../../../../../../services/journey/journeyUtilityService/journey-utility.service';
import {CollegeJourneyData} from '../../../../../../../services/journey/models/collegeJourney.model';
import {JourneyStep} from '../../../../../../../services/journey/models/journey.model';
import {SharedUtilityService} from '../../../../../../../services/utility/utility.service';
import {CollegeSummaryCardComponent} from './college-summary-card.component';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {CurrencyPipe} from '@angular/common';

class MockCollegeService {
  typeCollege: string;
  scholarshipsNotIncluded: boolean;
  stateId: string;
  householdIncome: number;
  taxFilingStatus: string;
  predictedOngoingContributions: number;
  startYear: number;
  accountLinked: boolean;
  logoUrl: string;
  accountBalance: string;
  existingSavings: number;
  total: number;
  flag1: boolean;
  flag2: boolean;
  accountName: string;

  constructor(_p1, _p2, _p3, _p4, _p5, _p6) {
    console.log(_p1 + _p2 + _p3 + _p4 + _p5 + _p6);
  }

  setTrackerAnswers(
    dependent: Record<string, string | number>,
    _allDependentSteps: JourneyStep[],
    _collegeJourneyDataPromise: Promise<CollegeJourneyData>,
    _oldDependentId: string
  ) {
    console.log(
      _allDependentSteps +
        _collegeJourneyDataPromise.toString() +
        _oldDependentId
    );
    const index = parseInt((dependent.id as string).substring(3));
    if (index > 1) {
      this.typeCollege = 'In-State Public';
    }
    if (index > 2) {
      this.scholarshipsNotIncluded = false;
    }
    if (index > 3) {
      this.stateId = 'NH';
    }
    if (index > 4) {
      this.householdIncome = 100000;
    }
    if (index > 5) {
      this.taxFilingStatus = 'Single';
    }
    this.predictedOngoingContributions = 500 + index;
    this.startYear = 2023 + index;
    if (index === 7) {
      this.accountLinked = true;
      this.logoUrl = 'logoUrl';
      this.accountBalance = '5000';
      this.accountName = 'accountName';
    } else {
      this.existingSavings = 1000 + index;
    }
    this.total = 100000 + index;
    this.flag1 = false;
    this.flag2 = true;
  }
}

describe('CollegeSummaryCardComponent', () => {
  let component: CollegeSummaryCardComponent;
  let fixture: ComponentFixture<CollegeSummaryCardComponent>;
  let collegeServiceSpy;
  let allDependentSteps;
  let collegeJourneyDataPromise;
  let journeyServiceSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'appendBaseUrlToEndpoints',
      ]);
      allDependentSteps = [
        {
          id: 'step1',
          journeyStepName: 'step1',
          journeyStepCMSTagId: 'cmstag1',
          msgType: 'msgType1',
        },
        {
          id: 'step2',
          journeyStepName: 'step2',
          journeyStepCMSTagId: 'cmstag2',
          msgType: 'msgType2',
        },
      ];
      collegeJourneyDataPromise = Promise.resolve({
        dependents: [
          {
            id: 'dependent1',
            firstName: 'firstName1',
            age: 10,
          },
          {
            id: 'dependent1',
            firstName: 'firstName1',
            age: 10,
          },
          {
            id: 'dependent2',
            firstName: 'firstName2',
            age: 5,
          },
        ],
        filingStatuses: [
          {
            id: 'MARRIED_SEPARATELY',
            value: 'MARRIED_SEPARATELY',
            label: 'Married Filing Separately',
          },
        ],
        collegeTypes: [
          {
            id: '1',
            value: '1',
            label: 'In-state Public',
          },
        ],
        states: [
          {
            id: 'AL',
            value: 'AL',
            label: 'Alabama',
          },
        ],
        defaultYearsOfAttendance: 4,
        defaultCollegeStartAge: 18,
        collegeStartAge: {
          defaultValue: 18,
        },
        yearsOfAttendance: {
          defaultValue: 4,
        },
        inflationRate: [],
        rateOfReturn: {
          defaultValue: 6,
        },
        simpleAnnualInterestRate: {
          defaultValue: 4.82,
        },
      });
      collegeServiceSpy = jasmine.createSpyObj('CollegeService', [''], {
        addedDependents: [
          {id: 'dep1'},
          {id: 'dep2'},
          {id: 'dep3'},
          {id: 'dep4'},
          {id: 'dep5'},
          {id: 'dep6', firstName: 'dependent6'},
          {id: 'dep6'},
          {id: 'dep7', firstName: 'dependent7'},
        ],
        allDependentSteps: allDependentSteps,
        collegeJourneyDataPromise: collegeJourneyDataPromise,
        whoAreYouSavingForId: 'whoAreYouSavingForId',
      });
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', ['openModal']);
      TestBed.configureTestingModule({
        declarations: [CollegeSummaryCardComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: CollegeService, useValue: collegeServiceSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: BaseService, useValue: undefined},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: MXService, useValue: undefined},
          {provide: JourneyUtilityService, useValue: undefined},
          {provide: CurrencyPipe, useValue: undefined},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CollegeSummaryCardComponent);
      component = fixture.componentInstance;
      component.summaryCard = {
        id: 'collegeSummaryCard',
        description: "Saving for {dependentName}'s College Goal",
        imageUrl: 'assets/icon/progressBarBackground.svg',
        label: 'Current Savings / Appx College Cost 4yrs',
        rows: [
          {
            label: 'Type of College',
            flag: 'flag1',
          },
          {
            answerId: 'typeCollege',
            label: 'Type of College2',
            flag: 'flag2',
          },
          {
            answerId: 'predictedOngoingContributions',
            label: 'Monthly Contribution Goal',
            type: 'dollar',
          },
          {
            answerId: 'startYear',
            label: 'Target Completion Date',
          },
        ],
        marginBottom: '0px',
        labelFontSize: '14px',
        type: 'dollar',
        bgColor: 'red',
        borderColor: 'yellow',
      };
      component['collegeServiceClass'] = MockCollegeService as any;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set up the summary cards according to the data in the service', async () => {
      component.dependentSummaryCards = [];
      await component.ngOnInit();
      expect(component.dependentSummaryCards).toEqual([
        {
          accountLinked: undefined,
          logoUrl: undefined,
          accountName: undefined,
          depId: 'dep6',
          description: "Saving for dependent6's College Goal",
          table: {
            rows: [
              {
                label: 'Type of College2',
                answer: 'In-State Public',
                answerId: undefined,
                flag: undefined,
              },
              {
                label: 'Monthly Contribution Goal',
                type: 'dollar',
                answer: 506,
                answerId: undefined,
                flag: undefined,
              },
              {
                label: 'Target Completion Date',
                answer: 2029,
                answerId: undefined,
                flag: undefined,
              },
            ],
            marginBottom: '0px',
            labelFontSize: '14px',
          },
          progressBar: {
            imageUrl: 'assets/icon/progressBarBackground.svg',
            label: 'Current Savings / Appx College Cost 4yrs',
            value: 1006,
            maxValue: 100006,
            type: 'dollar',
            bgColor: 'red',
            borderColor: 'yellow',
          },
        },
        {
          depId: 'dep7',
          accountLinked: true,
          logoUrl: 'logoUrl',
          accountName: 'accountName',
          description: "Saving for dependent7's College Goal",
          table: {
            rows: [
              {
                label: 'Type of College2',
                answer: 'In-State Public',
                answerId: undefined,
                flag: undefined,
              },
              {
                label: 'Monthly Contribution Goal',
                type: 'dollar',
                answer: 507,
                answerId: undefined,
                flag: undefined,
              },
              {
                label: 'Target Completion Date',
                answer: 2030,
                answerId: undefined,
                flag: undefined,
              },
            ],
            marginBottom: '0px',
            labelFontSize: '14px',
          },
          progressBar: {
            imageUrl: 'assets/icon/progressBarBackground.svg',
            label: 'Current Savings / Appx College Cost 4yrs',
            value: 5000,
            maxValue: 100007,
            type: 'dollar',
            bgColor: 'red',
            borderColor: 'yellow',
          },
        },
      ]);
    });
  });
});
