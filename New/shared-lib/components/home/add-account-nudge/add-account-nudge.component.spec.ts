import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {AddAccountNudgeComponent} from './add-account-nudge.component';
import {Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('AddAccountNudgeComponent', () => {
  let component: AddAccountNudgeComponent;
  let fixture: ComponentFixture<AddAccountNudgeComponent>;
  let utilityServiceSpy;
  let routerSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

      utilityServiceSpy.getIsWeb.and.returnValue(true);

      TestBed.configureTestingModule({
        declarations: [AddAccountNudgeComponent],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: Router, useValue: routerSpy},
        ],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(AddAccountNudgeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addAccountClicked', () => {
    it('should navigate to accounts/add-accounts if isWeb', () => {
      component.isWeb = true;

      component.addAccountClicked();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'accounts/add-accounts'
      );
    });

    it('should navigate to account/add-accounts if not isWeb', () => {
      component.isWeb = false;

      component.addAccountClicked();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        'account/add-accounts'
      );
    });
  });
});
