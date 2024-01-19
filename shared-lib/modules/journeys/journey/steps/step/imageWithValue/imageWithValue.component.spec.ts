import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ImageWithValueComponent} from './imageWithValue.component';

describe('ImageWithValueComponent', () => {
  let component: ImageWithValueComponent;
  let utilityServiceSpy;
  let fixture: ComponentFixture<ImageWithValueComponent>;

  beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'getIsWeb',
      ]);
      TestBed.configureTestingModule({
        declarations: [ImageWithValueComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ImageWithValueComponent);
      component = fixture.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getIsWeb', () => {
    utilityServiceSpy.getIsWeb.and.returnValue(true);
    component.ngOnInit();
    expect(component.isWeb).toEqual(true);
    expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
  });
});
