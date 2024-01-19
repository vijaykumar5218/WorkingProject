import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {IonicModule, ModalController, PopoverController} from '@ionic/angular';
import * as moment from 'moment';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {AlertWindowService} from '@mobile/app/modules/shared/service/alert-window/alert-window.service';
import {OrangeMoneyService} from '../../services/orange-money.service';
import * as pageTextFile from '../../constants/madlib.json';

import {MadlibModalComponent} from './madlib-modal.component';
import {OrangeData} from '@shared-lib/services/account/models/orange-money.model';
import {FormsModule} from '@angular/forms';
import {HelpPopoverComponent} from './help-popover/help-popover.component';

describe('MadlibModalComponent', () => {
  let component: MadlibModalComponent;
  let fixture: ComponentFixture<MadlibModalComponent>;
  const pageText = JSON.parse(JSON.stringify(pageTextFile)).default;
  const orangeMoneyServiceSpy = jasmine.createSpyObj('OrangeMoneyService', [
    'getOrangeData',
    'updateOrangeMoneyOptOut',
    'postMadlibData',
    'setOrangeData',
  ]);
  const alertWindowServiceSpy = jasmine.createSpyObj('AlertWindowService', [
    'presentAlert',
  ]);
  const modalControllerSpy = jasmine.createSpyObj('ModalController', [
    'dismiss',
  ]);
  const popoverControllerSpy = jasmine.createSpyObj('PopoverController', [
    'create',
  ]);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MadlibModalComponent],
        imports: [FormsModule, IonicModule.forRoot()],
        providers: [
          {provide: OrangeMoneyService, useValue: orangeMoneyServiceSpy},
          {provide: AlertWindowService, useValue: alertWindowServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: PopoverController, useValue: popoverControllerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MadlibModalComponent);
      component = fixture.componentInstance;
      orangeMoneyServiceSpy.getOrangeData.and.returnValue(of({madLibData: {}}));
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'fetchData');
    });

    it('should set min and max date for age picker', () => {
      component.ngOnInit();
      const min = moment()
        .subtract(99, 'year')
        .format('YYYY-MM-DD');
      const max = moment()
        .subtract(17, 'year')
        .format('YYYY-MM-DD');

      expect(component.minDate).toEqual(min);
      expect(component.maxDate).toEqual(max);
    });

    it('should call fetchData', async () => {
      component.ngOnInit();
      expect(component.fetchData).toHaveBeenCalled();
    });
  });

  describe('fetchData', () => {
    beforeEach(() => {
      spyOn(component, 'setMadLib');
    });

    it('should fetch data and set properties if it has madlib data', fakeAsync(() => {
      const orangeTestData = {
        madLibData: {
          adminUser: false,
          annualSalary: 50000.0,
          dob: '1956-01-01T00:00:00',
          firstName: 'TestFirst',
          firstTimeUser: false,
          madLib: false,
          madlibHelpContent: '',
          omTitle: '',
          participantStatus: '',
          promoTextForSkip: '',
          skipMadlibAllowed: true,
        },
      };
      orangeMoneyServiceSpy.getOrangeData.and.returnValue(
        of(orangeTestData).pipe(delay(1))
      );

      component.fetchData();
      expect(component.loading).toEqual(true);

      tick(1);

      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalled();

      expect(component.setMadLib).toHaveBeenCalledWith(
        orangeTestData.madLibData
      );

      expect(component.loading).toEqual(false);
    }));

    it('should fetch data and send update if error = opt-out', fakeAsync(() => {
      const orangeErrorTestData = {
        errorCode: 'opt-out',
      };
      orangeMoneyServiceSpy.getOrangeData.and.returnValue(
        of(orangeErrorTestData).pipe(delay(1))
      );

      const orangeTestData = {
        madLibData: {
          adminUser: false,
          annualSalary: 50000.0,
          dob: '1956-01-01T00:00:00',
          firstName: 'TestFirst',
          firstTimeUser: false,
          madLib: false,
          madlibHelpContent: '',
          omTitle: '',
          participantStatus: '',
          promoTextForSkip: '',
          skipMadlibAllowed: true,
        },
      };

      orangeMoneyServiceSpy.updateOrangeMoneyOptOut.and.returnValue(
        Promise.resolve(orangeTestData)
      );

      component.fetchData();

      expect(component.loading).toEqual(true);

      tick(1);

      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.updateOrangeMoneyOptOut).toHaveBeenCalled();
      expect(component.setMadLib).toHaveBeenCalledWith(
        orangeTestData.madLibData
      );
      expect(component.loading).toEqual(false);
    }));

    it('should fetch data and send update if error = opt-out, then display an error and close modal if another error come back', fakeAsync(() => {
      const orangeErrorTestData = {
        errorCode: 'opt-out',
      };
      orangeMoneyServiceSpy.getOrangeData.and.returnValue(
        of(orangeErrorTestData).pipe(delay(1))
      );

      const orangeTestData = {
        errorCode: 'server-issue',
      };

      orangeMoneyServiceSpy.updateOrangeMoneyOptOut.and.returnValue(
        Promise.resolve(orangeTestData)
      );

      spyOn(component, 'closeDialog');

      component.fetchData();

      expect(component.loading).toEqual(true);

      tick(1);

      expect(orangeMoneyServiceSpy.getOrangeData).toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.updateOrangeMoneyOptOut).toHaveBeenCalled();
      expect(component.setMadLib).not.toHaveBeenCalled();
      expect(alertWindowServiceSpy.presentAlert).toHaveBeenCalledWith({
        message: pageText.errorUpdatingMadlib,
      });
      expect(component.closeDialog).toHaveBeenCalled();
      expect(component.loading).toEqual(false);
    }));
  });

  describe('setMadLib', () => {
    it('should set madlib and age', () => {
      const madlibTestData = {
        adminUser: false,
        annualSalary: 50000.0,
        dob: '1956-01-01T00:00:00',
        firstName: 'TestFirst',
        firstTimeUser: false,
        madLib: false,
        madlibHelpContent: '',
        omTitle: '',
        participantStatus: '',
        promoTextForSkip: '',
        skipMadlibAllowed: true,
      };

      component.setMadLib(madlibTestData);

      expect(component.madlib).toEqual({
        adminUser: false,
        annualSalary: 50000.0,
        dob: '1956-01-01T00:00:00',
        firstName: 'TestFirst',
        firstTimeUser: false,
        madLib: false,
        madlibHelpContent: '',
        omTitle: '',
        participantStatus: '',
        promoTextForSkip: '',
        skipMadlibAllowed: true,
      });
      expect(component.salaryString).toEqual('50000');
      const currentYear = new Date().getFullYear();
      expect(component.age).toEqual(currentYear - 1956);
    });

    it('should set salary string to 0 if salary null', () => {
      const madlibTestData = {
        adminUser: false,
        annualSalary: null,
        dob: '1956-01-01T00:00:00',
        firstName: 'TestFirst',
        firstTimeUser: false,
        madLib: false,
        madlibHelpContent: '',
        omTitle: '',
        participantStatus: '',
        promoTextForSkip: '',
        skipMadlibAllowed: true,
      };

      component.setMadLib(madlibTestData);

      expect(component.madlib).toEqual({
        adminUser: false,
        annualSalary: null,
        dob: '1956-01-01T00:00:00',
        firstName: 'TestFirst',
        firstTimeUser: false,
        madLib: false,
        madlibHelpContent: '',
        omTitle: '',
        participantStatus: '',
        promoTextForSkip: '',
        skipMadlibAllowed: true,
      });
      expect(component.salaryString).toEqual('0');
      const currentYear = new Date().getFullYear();
      expect(component.age).toEqual(currentYear - 1956);
    });
  });

  describe('toggleShowSalary', () => {
    it('should toggle showSalary', () => {
      component.showSalary = false;
      component.toggleShowSalary();
      expect(component.showSalary).toEqual(true);

      component.toggleShowSalary();
      expect(component.showSalary).toEqual(false);
    });
  });

  describe('getAgeFromDOB', () => {
    it('should return the persons age from date of birth', () => {
      const result = component.getAgeFromDOB('1956-01-01T00:00:00');
      expect(result).toEqual(moment().diff('1956-01-01', 'years', false));
    });
  });

  describe('onDobChanged', () => {
    it('should update dob and age', () => {
      const ageSpy = spyOn(component, 'getAgeFromDOB');
      ageSpy.and.returnValue(20);

      component.madlib = {
        adminUser: false,
        annualSalary: 50000.0,
        dob: '1956-01-01T00:00:00',
        firstName: 'TestFirst',
        firstTimeUser: false,
        madLib: false,
        madlibHelpContent: '',
        omTitle: '',
        participantStatus: '',
        promoTextForSkip: '',
        skipMadlibAllowed: true,
      };

      const val = {
        detail: {
          value: '1970-01-01T00:00:00',
        },
      } as CustomEvent;

      component.onDobChanged(val);

      expect(component.madlib.dob).toEqual('1970-01-01');
      expect(component.age).toEqual(20);
    });
  });

  describe('onSalaryValueChanged', () => {
    it('should update salary and call validate', () => {
      spyOn(component, 'validateSalary');

      component.salaryString = '';
      component.onSalaryValueChanged('15,000.00');

      expect(component.salaryString).toEqual('15,000.00');
      expect(component.validateSalary).toHaveBeenCalled();
    });
  });

  describe('onFeelingChange', () => {
    it('should update selected feeling and call validate', () => {
      spyOn(component, 'validateFeeling');

      component.selectedFeeling = null;
      component.onFeelingChange('Happy');

      expect(component.selectedFeeling).toEqual('Happy');
      expect(component.validateFeeling).toHaveBeenCalled();
    });
  });

  describe('validateSalary', () => {
    it('should set salaryValid = true if valid input', () => {
      component.salaryString = '15,000.00';
      component.salaryValid = false;
      component.validateSalary();
      expect(component.salaryValid).toEqual(true);
    });

    it('should set salaryValid = false if invalid input', () => {
      component.salaryString = '15,00abc0.00';
      component.salaryValid = true;
      component.validateSalary();
      expect(component.salaryValid).toEqual(false);
    });

    it('should set salaryValid = true and salaryInBounds to false if > 9999999', () => {
      component.salaryString = '9999999.99';
      component.salaryValid = false;
      component.salaryInBounds = true;
      component.validateSalary();
      expect(component.salaryValid).toEqual(true);
      expect(component.salaryInBounds).toEqual(false);
    });
  });

  describe('validateFeeling', () => {
    it('should set feelingValid = true if valid input', () => {
      component.selectedFeeling = 'Happy';
      component.feelValid = false;
      component.validateFeeling();
      expect(component.feelValid).toEqual(true);
    });

    it('should set feelingValid = false if selectedFeeling = null', () => {
      component.selectedFeeling = null;
      component.feelValid = true;
      component.validateFeeling();
      expect(component.feelValid).toEqual(false);
    });
  });

  describe('validate', () => {
    beforeEach(() => {
      spyOn(component, 'validateSalary');
      spyOn(component, 'validateFeeling');
    });

    it('should call all validate function', () => {
      component.validate();

      expect(component.validateSalary).toHaveBeenCalled();
      expect(component.validateFeeling).toHaveBeenCalled();
    });

    it('should return true if everything is valid', () => {
      component.salaryValid = true;
      component.feelValid = true;

      const result = component.validate();
      expect(result).toEqual(true);
    });

    it('should return false if one field is invalid', () => {
      component.salaryValid = false;
      component.feelValid = true;

      const result = component.validate();
      expect(result).toEqual(false);
    });
  });

  describe('saveMadlibData', () => {
    beforeEach(() => {
      orangeMoneyServiceSpy.postMadlibData.calls.reset();
      orangeMoneyServiceSpy.setOrangeData.calls.reset();
    });

    it('should call validate and return if not valid', () => {
      const validateSpy = spyOn(component, 'validate');
      validateSpy.and.returnValue(false);

      component.saveMadlibData();
      expect(component.validate).toHaveBeenCalled();
      expect(orangeMoneyServiceSpy.postMadlibData).not.toHaveBeenCalled();
    });

    it('should validate, and then call postMadlibData and close on success', async () => {
      component.madlib = {
        adminUser: false,
        annualSalary: 50000.0,
        dob: '1956-01-01T00:00:00',
        firstName: 'TestFirst',
        firstTimeUser: false,
        madLib: false,
        madlibHelpContent: '',
        omTitle: '',
        participantStatus: '',
        promoTextForSkip: '',
        skipMadlibAllowed: true,
      };
      component.salaryString = '15,000.00';
      component.selectedFeeling = 'Happy';

      const validateSpy = spyOn(component, 'validate');
      validateSpy.and.returnValue(true);

      const cleanValueSpy = spyOn(component, 'getCleanedSalaryValue');
      cleanValueSpy.and.returnValue(15000.0);

      spyOn(component, 'closeDialog');

      const orangeData = {
        orangeData: {},
      } as OrangeData;
      orangeMoneyServiceSpy.postMadlibData.and.returnValue(
        Promise.resolve(orangeData)
      );

      await component.saveMadlibData();
      expect(component.validate).toHaveBeenCalled();
      expect(component.getCleanedSalaryValue).toHaveBeenCalledWith('15,000.00');
      expect(orangeMoneyServiceSpy.postMadlibData).toHaveBeenCalledWith(
        '1956-01-01T00:00:00',
        15000.0,
        'Happy'
      );
      expect(orangeMoneyServiceSpy.setOrangeData).toHaveBeenCalledWith(
        orangeData
      );
      expect(component.closeDialog).toHaveBeenCalled();
      expect(component.saveFailed).toEqual(false);
    });

    it('should validate, and then call postMadlibData and set saveFailed on failure', async () => {
      component.madlib = {
        adminUser: false,
        annualSalary: 50000.0,
        dob: '1956-01-01T00:00:00',
        firstName: 'TestFirst',
        firstTimeUser: false,
        madLib: false,
        madlibHelpContent: '',
        omTitle: '',
        participantStatus: '',
        promoTextForSkip: '',
        skipMadlibAllowed: true,
      };
      component.salaryString = '15,000.00';
      component.selectedFeeling = 'Happy';

      const validateSpy = spyOn(component, 'validate');
      validateSpy.and.returnValue(true);

      const cleanValueSpy = spyOn(component, 'getCleanedSalaryValue');
      cleanValueSpy.and.returnValue(15000.0);

      spyOn(component, 'closeDialog');

      const orangeData = {
        errorCode: 'error',
      } as OrangeData;
      orangeMoneyServiceSpy.postMadlibData.and.returnValue(
        Promise.resolve(orangeData)
      );

      await component.saveMadlibData();
      expect(component.validate).toHaveBeenCalled();
      expect(component.getCleanedSalaryValue).toHaveBeenCalledWith('15,000.00');
      expect(orangeMoneyServiceSpy.postMadlibData).toHaveBeenCalledWith(
        '1956-01-01T00:00:00',
        15000.0,
        'Happy'
      );
      expect(orangeMoneyServiceSpy.setOrangeData).not.toHaveBeenCalledWith(
        orangeData
      );
      expect(component.closeDialog).not.toHaveBeenCalled();
      expect(component.saveFailed).toEqual(true);
    });
  });

  describe('openHelp', () => {
    it('should open help popover', async () => {
      const popoverSpy = jasmine.createSpyObj('Popover', ['present']);
      popoverControllerSpy.create.and.returnValue(Promise.resolve(popoverSpy));

      await component.openHelp();
      expect(popoverControllerSpy.create).toHaveBeenCalledWith({
        component: HelpPopoverComponent,
        mode: 'md',
        showBackdrop: false,
      });
      expect(popoverSpy.present).toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    it('should call modal controller dismiss', () => {
      component.closeDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
