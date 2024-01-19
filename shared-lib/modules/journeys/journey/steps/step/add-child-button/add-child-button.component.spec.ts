import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AddChildButtonComponent} from './add-child-button.component';

describe('AddChildButtonComponent', () => {
  let component: AddChildButtonComponent;
  let fixture: ComponentFixture<AddChildButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddChildButtonComponent],
        imports: [IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(AddChildButtonComponent);
      component = fixture.componentInstance;
      component.element = {};
      fixture.detectChanges();
    })
  );
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
