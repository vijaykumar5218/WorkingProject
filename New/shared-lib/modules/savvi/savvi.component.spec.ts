import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {SavviComponent} from './savvi.component';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('SavviComponent', () => {
  let component: SavviComponent;
  let fixture: ComponentFixture<SavviComponent>;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
        'setSuppressHeaderFooter',
      ]);
      TestBed.configureTestingModule({
        declarations: [SavviComponent],
        imports: [HttpClientModule, RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SavviComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it('should call setSuppressHeaderFooter with true', () => {
      component.ionViewWillEnter();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        true
      );
    });
  });

  describe('ionViewWillLeave', () => {
    it('should call setSuppressHeaderFooter with false', () => {
      component.ionViewWillLeave();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        false
      );
    });
  });
});
