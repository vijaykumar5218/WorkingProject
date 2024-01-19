import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SummaryCardComponent} from './summary-card.component';

describe('SummaryCardComponent', () => {
  let component: SummaryCardComponent;
  let fixture: ComponentFixture<SummaryCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SummaryCardComponent],
        imports: [IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(SummaryCardComponent);
      component = fixture.componentInstance;
      component.summaryCard = {};
      component.index = 5;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the idSuffix to the index', () => {
      expect(component.summaryCard).toEqual({idSuffix: '5'});
    });
  });
});
