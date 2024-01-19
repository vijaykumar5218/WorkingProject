import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {HSAStorePage} from './hsastore.page';

describe('HSAStorePage', () => {
  let component: HSAStorePage;
  let fixture: ComponentFixture<HSAStorePage>;
  let utilityServiceSpy;
  let accountServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      utilityServiceSpy.getIsWeb.and.returnValue(true);

      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getHSAorFSA',
      ]);
      accountServiceSpy.getHSAorFSA.and.returnValue(
        Promise.resolve({
          hsa: false,
          fsa: false,
        })
      );

      TestBed.configureTestingModule({
        declarations: [HSAStorePage],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: AccountService, useValue: accountServiceSpy},
        ],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(HSAStorePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set hsaOrFsa', () => {
      expect(component.hsaOrFsa).toEqual({
        hsa: false,
        fsa: false,
      });
    });

    it('should set currentStore to hsa if hsa true', async () => {
      accountServiceSpy.getHSAorFSA.and.returnValue(
        Promise.resolve({
          hsa: true,
          fsa: false,
        })
      );

      await component.ngOnInit();

      expect(component.currentStore).toEqual('hsa');
    });

    it('should set currentStore to fsa if fsa true', async () => {
      accountServiceSpy.getHSAorFSA.and.returnValue(
        Promise.resolve({
          hsa: false,
          fsa: true,
        })
      );

      await component.ngOnInit();

      expect(component.currentStore).toEqual('fsa');
    });
  });

  describe('onSegmentChange', () => {
    it('should set currentStore to selected value', () => {
      const val = {
        detail: {
          value: 'fsa',
        },
      } as CustomEvent;

      component.currentStore = 'hsa';
      component.onSegmentChange(val);
      expect(component.currentStore).toEqual('fsa');
    });
  });
});
