import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {ImageWithValueSummaryComponent} from './image-with-value.component';

@Component({selector: 'journeys-steps-step-image-with-value', template: ''})
class MockJourneyStepImageWithValueComponent {
  @Input() imageUrl;
  @Input() value;
  @Input() top;
  @Input() left;
  @Input() fontSize;
}

describe('ImageWithValueSummaryComponent', () => {
  let component: ImageWithValueSummaryComponent;
  let fixture: ComponentFixture<ImageWithValueSummaryComponent>;
  let journeyServiceSpy;
  let setImageUrlSpy;
  let content;
  let handleEmptyValueSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'findElementByProp',
        'isValueEmpty',
      ]);
      TestBed.configureTestingModule({
        declarations: [
          ImageWithValueSummaryComponent,
          MockJourneyStepImageWithValueComponent,
        ],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(ImageWithValueSummaryComponent);
      component = fixture.componentInstance;
      setImageUrlSpy = spyOn(component, 'setImageUrl');
      handleEmptyValueSpy = spyOn(component, 'handleEmptyValue');
      content = {
        pageElements: [
          {
            elements: [
              {
                id: 'intro',
                header: 'When do you want to retire?',
                description:
                  'At what age would you like to retire? You can always change this later as you update the plan.',
              },
              {
                id: 'imageWithValue',
                imageUrl: 'assets/icon/journeys/retirement/Group_396.svg',
              },
              {
                id: 'input',
                answerId: 'retirementAge',
                type: 'textField',
                label: 'Retirement Age',
                default: 67,
                help: {
                  header: 'Why do we need this info?',
                  message:
                    "The age you plan to retire is just a starting point. This will help understand how much money you’ll need in retirement and how much longer you have to save. Also, there are other benefits and considerations that are dependent on your age, such as Social Security and Medicare, so it's important to plan ahead.",
                },
              },
              {id: 'button', label: 'Continue', link: 'default'},
            ],
          },
        ],
      };
      component.content = content;
      component.element = {
        id: 'imageWithValue',
        answerId: 'monthlyBudget',
        imageUrl: 'assets/icon/journeys/family/step5.svg',
        top: '15%',
        left: '27%',
        fontSize: '11vw',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call setImageUrl', () => {
      expect(setImageUrlSpy).toHaveBeenCalled();
    });

    it('shoudl call handleEmptyValue', () => {
      expect(handleEmptyValueSpy).toHaveBeenCalled();
    });
  });

  describe('setImageUrl', () => {
    beforeEach(() => {
      setImageUrlSpy.and.callThrough();
    });

    it('should set the imageUrl to the value sent back by journeyService if it is truthy', () => {
      const imageUrl = 'imageUrl';
      component.imageUrl = undefined;
      journeyServiceSpy.findElementByProp.and.returnValue({imageUrl: imageUrl});
      component.setImageUrl();
      expect(journeyServiceSpy.findElementByProp).toHaveBeenCalledWith(
        content,
        'id',
        'imageWithValue'
      );
      expect(component.imageUrl).toEqual(imageUrl);
    });

    it('should set the imageUrl to the elements imageUrl if nothing found in journeyservice', () => {
      const imageUrl = 'imageUrl';
      component.imageUrl = undefined;
      journeyServiceSpy.findElementByProp.and.returnValue(undefined);
      component.element.imageUrl = imageUrl;
      component.setImageUrl();
      expect(journeyServiceSpy.findElementByProp).toHaveBeenCalledWith(
        content,
        'id',
        'imageWithValue'
      );
      expect(component.imageUrl).toEqual(imageUrl);
    });
  });

  describe('handleEmptyValue', () => {
    beforeEach(() => {
      spyOn(component.valueEmpty, 'emit');
      component.value = undefined;
      handleEmptyValueSpy.and.callThrough();
      journeyServiceSpy.isValueEmpty.and.returnValue(true);
    });

    it('should emit true and set value to - if value is $', () => {
      component.element.answer = '$';
      component.handleEmptyValue();
      expect(component.valueEmpty.emit).toHaveBeenCalledWith(true);
      expect(component.value).toEqual('-');
    });

    it('should emit true and set value to - if value is empty string', () => {
      component.element.answer = '';
      component.handleEmptyValue();
      expect(component.valueEmpty.emit).toHaveBeenCalledWith(true);
      expect(component.value).toEqual('-');
    });

    it('should emit true and set value to $0 if value is $0', () => {
      component.element.answer = '$0';
      journeyServiceSpy.isValueEmpty.and.returnValue(false);
      component.handleEmptyValue();
      expect(component.valueEmpty.emit).toHaveBeenCalledWith(true);
      expect(component.value).toEqual('$0');
    });
  });
});
