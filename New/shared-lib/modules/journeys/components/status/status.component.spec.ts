import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {IonicModule} from '@ionic/angular';
import {Status} from '@shared-lib/constants/status.enum';
import {StatusComponent} from './status.component';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StatusComponent],
        imports: [IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(StatusComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    it('should display the div for the indicator with class in-progress for in progress', () => {
      component.status = Status.inProgress;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.in-progress'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.completed'))).toBeFalsy();
    });

    it('should display the div for the indicator with class completed for completed', () => {
      component.status = Status.completed;
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.completed'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('.in-progress'))).toBeFalsy();
    });

    it('should display the status span', () => {
      component.status = Status.completed;
      fixture.detectChanges();
      const status = fixture.debugElement.query(By.css('span'));
      expect(status).toBeTruthy();
      expect(status.nativeElement.innerHTML.trim()).toEqual('Completed');
    });
  });
});
