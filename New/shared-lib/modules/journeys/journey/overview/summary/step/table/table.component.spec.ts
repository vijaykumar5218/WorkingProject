import {ComponentFixture, waitForAsync, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ValidationType} from '@shared-lib/services/journey/constants/validationType.enum';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {TableSummaryComponent} from './table.component';

describe('TableSummaryComponent', () => {
  let component: TableSummaryComponent;
  let fixture: ComponentFixture<TableSummaryComponent>;
  let journeyServiceSpy;
  let processTableConfigSpy;
  let originalElement;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'findElementByProp',
        'safeParse',
        'isValueEmpty',
      ]);
      originalElement = {
        id: 'input',
        answerId: 'leaveInputs',
        type: 'table',
        config: {
          rows: [
            {
              columns: [
                {
                  description: 'Type',
                },
                {
                  description: '# of Weeks',
                },
                {
                  description: '% of Paid Wages',
                },
              ],
            },
            {
              columns: [
                {
                  header: 'Short-term disability',
                },
                {
                  id: 'input',
                  answerId: 'disabilityWeeks',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 52,
                  },
                },
                {
                  id: 'input',
                  answerId: 'disabilityPercent',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 100,
                  },
                },
              ],
            },
            {
              columns: [
                {
                  header: 'Parental bonding time',
                },
                {
                  id: 'input',
                  answerId: 'parentalBondingWeeks',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 52,
                  },
                },
                {
                  id: 'input',
                  answerId: 'parentalBondingPercent',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 100,
                  },
                },
              ],
            },
            {
              columns: [
                {
                  header: 'PTO as part of FMLA',
                },
                {
                  id: 'input',
                  answerId: 'fmlaPTOWeeks',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 52,
                  },
                },
                {
                  id: 'input',
                  answerId: 'fmlaPTOPercent',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 100,
                  },
                },
              ],
            },
            {
              columns: [
                {
                  header: 'PTO in addition to FMLA',
                },
                {
                  id: 'input',
                  answerId: 'ptoWeeks',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 52,
                  },
                },
                {
                  id: 'input',
                  answerId: 'ptoPercent',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 100,
                  },
                },
              ],
            },
            {
              columns: [
                {
                  header: 'Unpaid FMLA',
                },
                {
                  id: 'input',
                  answerId: 'unpaidFMLAWeeks',
                },
                {
                  id: 'input',
                  answerId: 'unpaidFMLAPercent',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 100,
                  },
                },
              ],
            },
            {
              columns: [
                {
                  header: 'Unpaid non-FMLA',
                },
                {
                  id: 'input',
                  answerId: 'unpaidNonFMLAWeeks',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 52,
                  },
                },
                {
                  id: 'input',
                  answerId: 'unpaidNonFMLAPercent',
                  validationRules: {
                    type: ValidationType.number,
                    decimalPlaces: 0,
                    min: 0,
                    max: 100,
                  },
                },
              ],
            },
          ],
        },
      };
      journeyServiceSpy.findElementByProp.and.returnValue(originalElement);
      TestBed.configureTestingModule({
        declarations: [TableSummaryComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(TableSummaryComponent);
      component = fixture.componentInstance;
      component.element = {
        answerId: 'answer',
      };
      component.content = {
        pageElements: [{elements: [originalElement]}],
      };
      component.config = {rows: []};
      processTableConfigSpy = spyOn(component, 'processTableConfig');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call journeyService.findElementByProp to get original table config', () => {
      expect(journeyServiceSpy.findElementByProp).toHaveBeenCalledWith(
        component.content,
        'answerId',
        'answer'
      );
    });

    it('should call processTableConfig', () => {
      expect(component.processTableConfig).toHaveBeenCalledWith(
        originalElement
      );
    });
  });

  describe('processTableConfig', () => {
    let expectedConfig;
    beforeEach(() => {
      processTableConfigSpy.and.callThrough();
      component.config.rows = [];
      expectedConfig = [
        {
          columns: [
            {
              description: 'Type',
            },
            {
              description: '# of Weeks',
            },
            {
              description: '% of Paid Wages',
            },
          ],
        },
        {
          columns: [
            {
              header: 'PTO as part of FMLA',
              answer: undefined,
            },
            {
              id: 'input',
              answerId: 'fmlaPTOWeeks',
              validationRules: {
                type: ValidationType.number,
                decimalPlaces: 0,
                min: 0,
                max: 52,
              },
              answer: '12',
            },
            {
              id: 'input',
              answerId: 'fmlaPTOPercent',
              validationRules: {
                type: ValidationType.number,
                decimalPlaces: 0,
                min: 0,
                max: 100,
              },
              answer: undefined,
            },
          ],
        },
        {
          columns: [
            {
              header: 'Unpaid non-FMLA',
              answer: undefined,
            },
            {
              id: 'input',
              answerId: 'unpaidNonFMLAWeeks',
              validationRules: {
                type: ValidationType.number,
                decimalPlaces: 0,
                min: 0,
                max: 52,
              },
              answer: undefined,
            },
            {
              id: 'input',
              answerId: 'unpaidNonFMLAPercent',
              validationRules: {
                type: ValidationType.number,
                decimalPlaces: 0,
                min: 0,
                max: 100,
              },
              answer: '5',
            },
          ],
        },
      ];
    });

    it('should set the config with all of the rows that have no inputs or have at least one answer and not show total if showTotal is false', () => {
      component.element.showTotal = false;
      journeyServiceSpy.safeParse.and.returnValue([
        {answerId: 'unpaidNonFMLAPercent', value: '5'},
        {answerId: 'fmlaPTOWeeks', value: '12'},
      ]);
      component.processTableConfig(originalElement);
      expect(component.config.rows).toEqual(expectedConfig);
    });

    it('should set the answer to - if it is empty', () => {
      component.element.showTotal = false;
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
      journeyServiceSpy.safeParse.and.returnValue([
        {answerId: 'unpaidNonFMLAPercent', value: '5'},
        {answerId: 'fmlaPTOWeeks', value: '12'},
      ]);
      component.processTableConfig(originalElement);
      expectedConfig[1].columns[0].answer = '-';
      expectedConfig[1].columns[1].answer = '-';
      expectedConfig[1].columns[2].answer = '-';
      expectedConfig[2].columns[0].answer = '-';
      expectedConfig[2].columns[1].answer = '-';
      expectedConfig[2].columns[2].answer = '-';
      expect(component.config.rows).toEqual(expectedConfig);
    });

    it('should set the config with all of the rows that have no inputs or have at least one answer and show total if showTotal is true', () => {
      component.element.showTotal = true;
      journeyServiceSpy.safeParse.and.returnValue([
        {answerId: 'unpaidNonFMLAPercent', value: '5'},
        {answerId: 'fmlaPTOWeeks', value: '12'},
        {answerId: 'fmlaPTOPercent', value: '55'},
      ]);
      const totalLabel = 'totalLabel';
      component.element.totalLabel = totalLabel;
      component.processTableConfig(originalElement);
      expectedConfig[1].columns[2].answer = '55';
      expectedConfig.push({
        columns: [
          {totalLabel: totalLabel},
          {
            id: 'input',
            answer: '12',
          },
          {
            id: 'input',
            answer: '60',
          },
        ],
      });

      expect(component.config.rows).toEqual(expectedConfig);
    });

    it('should set the config with all of the rows that have no inputs or have at least one answer and show total with - if showTotal is true and no answer given in column', () => {
      component.element.showTotal = true;
      journeyServiceSpy.safeParse.and.returnValue([
        {answerId: 'unpaidNonFMLAPercent', value: '5'},
        {answerId: 'fmlaPTOPercent', value: '55'},
      ]);
      const totalLabel = 'totalLabel';
      component.element.totalLabel = totalLabel;
      component.processTableConfig(originalElement);
      expectedConfig[1].columns[1].answer = undefined;
      expectedConfig[1].columns[2].answer = '55';
      expectedConfig.push({
        columns: [
          {totalLabel: totalLabel},
          {
            id: 'input',
            answer: '-',
          },
          {
            id: 'input',
            answer: '60',
          },
        ],
      });
      expect(component.config.rows).toEqual(expectedConfig);
    });

    it('should set the rows of the config to [] if no inputs have answers', () => {
      journeyServiceSpy.safeParse.and.returnValue([]);
      component.processTableConfig(originalElement);
      expect(component.config.rows).toEqual([]);
    });
  });
});
