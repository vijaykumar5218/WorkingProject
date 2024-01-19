import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AsOfComponent} from './as-of.component';

describe('AsOfComponent', () => {
  let component: AsOfComponent;
  let fixture: ComponentFixture<AsOfComponent>;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      TestBed.configureTestingModule({
        declarations: [AsOfComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AsOfComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set isWeb true', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.ngOnInit();
      expect(component.isWeb).toEqual(true);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
    it('should set isWeb false', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.ngOnInit();
      expect(component.isWeb).toEqual(false);
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
    });
  });
});
