import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, PopoverController} from '@ionic/angular';

import {SortPopoverComponent} from './sort-popover.component';
import {AccountService} from '@shared-lib/services/account/account.service';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {of} from 'rxjs';

describe('SortPopoverComponent', () => {
  let component: SortPopoverComponent;
  let fixture: ComponentFixture<SortPopoverComponent>;
  let accountServiceSpy;
  let popoverCtrlSpy;
  let benefitServiceSpy;
  let storedKeyArrMock;

  beforeEach(
    waitForAsync(() => {
      storedKeyArrMock = 'abc';

      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'changeSort',
        'getSortSlcted',
        'setSortSlcted',
      ]);

      benefitServiceSpy = jasmine.createSpyObj('BenefitsService', [
        'changeSort',
        'getSortSlcted',
        'setSortSlcted',
      ]);

      popoverCtrlSpy = jasmine.createSpyObj('PopoverController', ['dismiss']);

      TestBed.configureTestingModule({
        declarations: [SortPopoverComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: BenefitsService, useValue: benefitServiceSpy},
          {provide: PopoverController, useValue: popoverCtrlSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SortPopoverComponent);
      component = fixture.componentInstance;

      component.service = accountServiceSpy;

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set selectedValue on ngOnInit', () => {
      accountServiceSpy.getSortSlcted.and.returnValue(
        Promise.resolve(of(storedKeyArrMock))
      );
      component.selectedValue = 'abc';
      component.ngOnInit();

      expect(accountServiceSpy.getSortSlcted).toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    beforeEach(() => {
      component.selectedSort = '';
      component.selectedValue = 'asc';
    });
    it('when data would be true', () => {
      component.closeDialog(true);
      expect(accountServiceSpy.changeSort).toHaveBeenCalledWith('asc');
      expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    });
    it('when data would be false', () => {
      component.closeDialog(false);
      expect(accountServiceSpy.changeSort).toHaveBeenCalledWith('');
      expect(popoverCtrlSpy.dismiss).toHaveBeenCalled();
    });
  });
});
