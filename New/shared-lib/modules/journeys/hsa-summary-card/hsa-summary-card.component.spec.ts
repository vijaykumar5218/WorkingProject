import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {HSAService} from '../../../services/journey/hsaService/hsa.service';
import {JourneyService} from '../../../services/journey/journey.service';
import {HSASummaryCardComponent} from './hsa-summary-card.component';

describe('HSASummaryCardComponent', () => {
  let component: HSASummaryCardComponent;
  let fixture: ComponentFixture<HSASummaryCardComponent>;
  let hsaServiceSpy;
  let content;
  let valueChange;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(async () => {
      hsaServiceSpy = jasmine.createSpyObj('HSAService', ['fetchGoalJSON']);
      valueChange = of();
      hsaServiceSpy.valueChange = valueChange;
      content = {
        label: 'summaryCardContent',
      };
      hsaServiceSpy.fetchGoalJSON.and.returnValue(Promise.resolve(content));
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', ['openModal']);
      TestBed.configureTestingModule({
        declarations: [HSASummaryCardComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HSAService, useValue: hsaServiceSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HSASummaryCardComponent);
      component = fixture.componentInstance;
      await fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should add the content to the summaryCard element', () => {
      expect(hsaServiceSpy.fetchGoalJSON).toHaveBeenCalled();
      expect(component.summaryCard).toEqual(content);
    });

    it('should subscribe to value change and set the value and maxValue', async () => {
      component.summaryCard.value = undefined;
      component.summaryCard.maxValue = undefined;
      component.accountLinked = undefined;
      component.logoUrl = undefined;
      component.onFile = undefined;
      hsaServiceSpy.ytdContribution = 500;
      hsaServiceSpy.adjustedMaxContribution = 1000;
      hsaServiceSpy.accountLinked = true;
      hsaServiceSpy.onFile = false;
      const logoUrl = 'logoUrl';
      hsaServiceSpy.logoUrl = logoUrl;
      const subscriptionSpy = jasmine.createSpyObj('subscription', ['']);
      spyOn(valueChange, 'subscribe').and.callFake(f => {
        f();
        return subscriptionSpy;
      });
      spyOn(component['subscription'], 'add');
      await component.ngOnInit();
      expect(component['subscription'].add).toHaveBeenCalledWith(
        subscriptionSpy
      );
      expect(valueChange.subscribe).toHaveBeenCalled();
      expect(component.summaryCard.maxValue).toEqual(1000);
      expect(component.summaryCard.value).toEqual(500);
      expect(component.accountLinked).toBeTrue();
      expect(component.logoUrl).toEqual(logoUrl);
      expect(component.onFile).toBeFalse();
    });
  });

  describe('openDialog', () => {
    it('should show revisit journey modal', async () => {
      await component.openDialog();
      expect(journeyServiceSpy.openModal).toHaveBeenCalledWith(
        {element: {id: 'revisit-journey-modal'}},
        false
      );
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from subscription', () => {
      spyOn(component['subscription'], 'unsubscribe');
      component.ngOnDestroy();
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });
});
