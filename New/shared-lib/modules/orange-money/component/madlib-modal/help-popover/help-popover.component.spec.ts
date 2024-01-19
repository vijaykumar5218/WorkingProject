import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {FormsModule} from '@angular/forms';
import {HelpPopoverComponent} from './help-popover.component';

describe('HelpPopoverComponent', () => {
  let component: HelpPopoverComponent;
  let fixture: ComponentFixture<HelpPopoverComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HelpPopoverComponent],
        imports: [FormsModule, IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(HelpPopoverComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
