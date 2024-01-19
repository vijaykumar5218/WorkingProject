import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {DateRangeFilterComponent} from './date-range-filter.component';

import {IonicModule, PopoverController} from '@ionic/angular';

import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';

describe('DateRangeFilterComponent', () => {
  let component: DateRangeFilterComponent;
  let fixture: ComponentFixture<DateRangeFilterComponent>;
  let benefitsServiceSpy;
  let popoverCtrlSpy;
  let closeDialogSpy;
  beforeEach(
    waitForAsync(() => {
      benefitsServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'changeDateOptions',
      ]);
      popoverCtrlSpy = jasmine.createSpyObj('PopoverController', ['dismiss']);

      TestBed.configureTestingModule({
        declarations: [DateRangeFilterComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitsServiceSpy},
          {provide: PopoverController, useValue: popoverCtrlSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DateRangeFilterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      closeDialogSpy = spyOn(component, 'closeDialog');
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onChange', () => {
    it('should load selectedFilter', () => {
      const selectedDateOpt = '1';
      component.onChange();
      component.selectedDateOpt = selectedDateOpt;
      expect(component.selectedDateOpt).toEqual('1');
    });
  });

  describe('closeDialog', () => {
    beforeEach(() => {
      closeDialogSpy.and.callThrough();
      component.selectedDateOpt = '3Months';
    });
    it('when save will be true', () => {
      component.closeDialog(true);
      expect(benefitsServiceSpy.changeDateOptions).toHaveBeenCalledWith(
        component.selectedDateOpt
      );
      expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    });
    it('save will be false', () => {
      component.closeDialog(false);
      expect(benefitsServiceSpy.changeDateOptions).not.toHaveBeenCalled();
      expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    });
  });
});
