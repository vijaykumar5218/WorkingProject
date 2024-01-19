import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';

import {LabelComponent} from './label.component';

describe('LabelComponent', () => {
  let component: LabelComponent;
  let fixture: ComponentFixture<LabelComponent>;
  let journeyServiceSpy;
  let journeyUtiltyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [''], {
        journeyServiceMap: {
          1: {
            valueChange: of(),
          },
        },
      });
      journeyUtiltyServiceSpy = jasmine.createSpyObj('JourneyUtilityService', [
        'processInnerHTMLData',
      ]);
      TestBed.configureTestingModule({
        declarations: [LabelComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: JourneyUtilityService, useValue: journeyUtiltyServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LabelComponent);
      component = fixture.componentInstance;
      component.element = {};
      component.journeyId = 1;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(journeyServiceSpy.journeyServiceMap[1].valueChange, 'subscribe');
    });

    it('should not subscribe to value change if there are no elements', () => {
      component.ngOnInit();
      expect(
        journeyServiceSpy.journeyServiceMap[1].valueChange.subscribe
      ).not.toHaveBeenCalled();
    });

    it('should set the labelValue to element.label if there are no elements', () => {
      const label = 'abc';
      component.element.label = label;
      component.labelValue = undefined;
      component.ngOnInit();
      expect(component.labelValue).toEqual(label);
    });

    it('should subscribe to value change and call processInnerHTMLData if there are elements', () => {
      component.element.elements = [];
      journeyServiceSpy.journeyServiceMap[1].valueChange.subscribe.and.callFake(
        f => f()
      );
      component['processInnerHTMLData'] = jasmine.createSpy();
      component.ngOnInit();
      expect(
        journeyServiceSpy.journeyServiceMap[1].valueChange.subscribe
      ).toHaveBeenCalled();
      expect(component['processInnerHTMLData']).toHaveBeenCalled();
    });
  });

  describe('processInnerHTMLData', () => {
    it('should call journeyuitlityservice to get replaced label', () => {
      component.labelValue = undefined;
      const label = 'label {2} with dynamic {0} values {1}';
      const elements = [
        {answerId: 'answerId1', bold: true},
        {answerId: 'answerId2', type: 'dollar', bold: true},
        {answerId: 'answerId3', type: 'dollar'},
      ];
      component.element = {
        label: label,
        elements: elements,
      };
      const replacedLabel = 'replacedLabel';
      journeyUtiltyServiceSpy.processInnerHTMLData.and.returnValue(
        replacedLabel
      );
      component['processInnerHTMLData']();
      expect(journeyUtiltyServiceSpy.processInnerHTMLData).toHaveBeenCalledWith(
        label,
        elements,
        1
      );
      expect(component.labelValue).toEqual(replacedLabel);
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
