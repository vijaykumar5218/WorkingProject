import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {BeforeStartingComponent} from './before-starting.component';
import {SharedUtilityService} from '../../../../services/utility/utility.service';
import {OpenSavviService} from '@shared-lib/services/benefits/open-savvi/open-savvi.service';

describe('BeforeStartingComponent', () => {
  let component: BeforeStartingComponent;
  let fixture: ComponentFixture<BeforeStartingComponent>;
  let routerSpy;
  let utilityServiceSpy;
  let openSavviServiceSpy;

  beforeEach(
    waitForAsync(() => {
      routerSpy = jasmine.createSpyObj('Router', ['navigate'], {url: 'url'});
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      openSavviServiceSpy = jasmine.createSpyObj('OpenSavviService', [
        'openSavvi',
      ]);
      TestBed.configureTestingModule({
        declarations: [BeforeStartingComponent],
        imports: [RouterTestingModule, IonicModule.forRoot()],
        providers: [
          {provide: Router, useValue: routerSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: OpenSavviService, useValue: openSavviServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(BeforeStartingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openSavvi', () => {
    it('should navigate to Savvi enrollment guidance for web', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      spyOn(component.closeModal, 'emit');
      component.openSavvi();
      expect(routerSpy.navigate).toHaveBeenCalledWith([
        'savvi/enrollment-guidance',
        {previousUrl: 'url'},
      ]);
      expect(openSavviServiceSpy.openSavvi).not.toHaveBeenCalled();
      expect(component.closeModal.emit).toHaveBeenCalled();
    });
  });

  it('call opensavvi to open the iab for mobile', () => {
    utilityServiceSpy.getIsWeb.and.returnValue(false);
    spyOn(component.closeModal, 'emit');
    component.openSavvi();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(openSavviServiceSpy.openSavvi).toHaveBeenCalled();
  });
});
