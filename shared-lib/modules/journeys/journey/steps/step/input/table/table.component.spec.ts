import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ValidationType} from '@shared-lib/services/journey/constants/validationType.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {TableComponent} from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      TestBed.configureTestingModule({
        declarations: [TableComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TableComponent);
      component = fixture.componentInstance;
      component.element = {
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
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should default values if defaultValue is passed in', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      const defaultVal = [
        {answerId: 'id1', value: 'text1'},
        {answerId: 'id2', value: 'text2'},
      ];
      component.defaultValue = JSON.stringify(defaultVal);
      component['value'] = undefined;
      component.ngOnInit();
      expect(component['values']).toEqual(defaultVal);
      expect(component.isWeb).toBe(true);
    });

    it('should not default values if defaultValue is not passed in', () => {
      const val = [
        {answerId: 'id1', value: 'text1'},
        {answerId: 'id2', value: 'text2'},
      ];
      component.defaultValue = undefined;
      component['values'] = val;
      component.ngOnInit();
      expect(component['values']).toEqual(val);
    });
  });

  describe('emitValueChange', () => {
    beforeEach(() => {
      spyOn(component.inputChange, 'emit');
    });

    it('should update the value and emit if the id is already in values', () => {
      component['values'] = [
        {
          answerId: 'id1',
          value: '10',
        },
        {
          answerId: 'id2',
          value: '12',
        },
        {
          answerId: 'id3',
          value: '25',
        },
      ];
      spyOn(component, 'getValByAnswerId').and.returnValue(
        component['values'][1]
      );
      component.emitValueChange('52', 'id2');
      expect(component['values']).toEqual([
        {
          answerId: 'id1',
          value: '10',
        },
        {
          answerId: 'id2',
          value: '52',
        },
        {
          answerId: 'id3',
          value: '25',
        },
      ]);
      expect(component.inputChange.emit).toHaveBeenCalledWith(
        JSON.stringify([
          {
            answerId: 'id1',
            value: '10',
          },
          {
            answerId: 'id2',
            value: '52',
          },
          {
            answerId: 'id3',
            value: '25',
          },
        ])
      );
    });

    it('should push the value and emit if the id is not already in values', () => {
      component['values'] = [
        {
          answerId: 'id1',
          value: '10',
        },
        {
          answerId: 'id3',
          value: '25',
        },
      ];
      spyOn(component, 'getValByAnswerId').and.returnValue(undefined);
      component.emitValueChange('52', 'id2');
      expect(component['values']).toEqual([
        {
          answerId: 'id1',
          value: '10',
        },
        {
          answerId: 'id3',
          value: '25',
        },
        {
          answerId: 'id2',
          value: '52',
        },
      ]);
      expect(component.inputChange.emit).toHaveBeenCalledWith(
        JSON.stringify([
          {
            answerId: 'id1',
            value: '10',
          },
          {
            answerId: 'id3',
            value: '25',
          },
          {
            answerId: 'id2',
            value: '52',
          },
        ])
      );
    });

    describe('getValByAnswerId', () => {
      it('should return the value for the answerId', () => {
        component['values'] = [
          {
            answerId: 'id1',
            value: '10',
          },
          {
            answerId: 'id3',
            value: '25',
          },
        ];
        const result = component.getValByAnswerId('id3');
        expect(result).toEqual({
          answerId: 'id3',
          value: '25',
        });
      });
    });
  });
});
