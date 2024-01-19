import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {HeaderTypeService} from '@web/app/modules/shared/services/header-type/header-type.service';
import {Environment} from '@shared-lib/models/environment.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {DashboardHeaderComponent} from './dashboard-header.component';

describe('DashboardHeaderComponent', () => {
  let component: DashboardHeaderComponent;
  let fixture: ComponentFixture<DashboardHeaderComponent>;
  let headerTypeServiceSpy;
  let sharedUtilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getEnvironment',
      ]);
      sharedUtilityServiceSpy.getEnvironment.and.returnValue({
        authTokenExchangeClient: 'token_client',
        tokenBaseUrl: 'http://token.test.com/',
        loginBaseUrl: 'http://login.test.com/',
      } as Environment);

      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'qualtricsInitialize',
      ]);

      TestBed.configureTestingModule({
        declarations: [DashboardHeaderComponent],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DashboardHeaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call qualtricsInitialize and getEnvironment', () => {
      expect(component.loginBaseUrl).toEqual('http://login.test.com');
      expect(headerTypeServiceSpy.qualtricsInitialize).toHaveBeenCalled();
      expect(sharedUtilityServiceSpy.getEnvironment).toHaveBeenCalled();
    });
  });
});
