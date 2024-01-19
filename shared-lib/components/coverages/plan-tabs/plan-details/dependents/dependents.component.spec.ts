import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {DependentsComponent} from './dependents.component';

describe('DependentsComponent', () => {
  let component: DependentsComponent;
  let fixture: ComponentFixture<DependentsComponent>;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      TestBed.configureTestingModule({
        declarations: [DependentsComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DependentsComponent);
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
