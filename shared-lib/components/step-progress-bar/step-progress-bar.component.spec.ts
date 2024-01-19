import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {StepProgressBarComponent} from './step-progress-bar.component';

describe('StepProgressBarComponent', () => {
  let component: StepProgressBarComponent;
  let fixture: ComponentFixture<StepProgressBarComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StepProgressBarComponent],
        imports: [IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(StepProgressBarComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
