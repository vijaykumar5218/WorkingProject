import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {WordSummaryComponent} from './word.component';

describe('WordSummaryComponent', () => {
  let component: WordSummaryComponent;
  let fixture: ComponentFixture<WordSummaryComponent>;
  let processParsedAnswerSpy;
  let journeyServiceSpy;
  let content;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'findElementByProp',
        'safeParse',
      ]);
      TestBed.configureTestingModule({
        declarations: [WordSummaryComponent],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(WordSummaryComponent);
      component = fixture.componentInstance;
      processParsedAnswerSpy = spyOn(component, 'processParsedAnswer');
      content = {
        pageElements: [
          {
            elements: [
              {
                id: 'intro',
                header: 'What is most important to you?',
                description: 'Select all that apply!',
              },
              {
                id: 'input',
                answerId: 'wordGroup',
                type: 'wordGroup',
                options: [
                  {
                    text: 'Travel',
                    id: 'travel',
                    imageUrl:
                      'assets/icon/journeys/retirement/wordGroupIcons/travel.svg',
                  },
                  {text: 'Volunteer', id: 'volunteer'},
                  {
                    text: 'Be debt free',
                    id: 'debt_free',
                    imageUrl:
                      'assets/icon/journeys/retirement/wordGroupIcons/debtFree.svg',
                  },
                  {
                    text: 'Spend more time with family',
                    id: 'family_time',
                    imageUrl:
                      'assets/icon/journeys/retirement/wordGroupIcons/family.svg',
                  },
                  {text: 'Start new career', id: 'new_career'},
                  {text: 'Learn new skill', id: 'new_skill'},
                  {text: 'Move somewhere new', id: 'move'},
                  {text: 'Invest in business', id: 'invest_business'},
                  {
                    text: 'Home renovations',
                    id: 'home_renovations',
                    imageUrl: 'assets/icon/journeys/In_Company.svg',
                  },
                  {text: 'Gift money to friends', id: 'gift_money'},
                  {text: 'Start a business', id: 'start_business'},
                  {text: 'New hobby', id: 'new_hobby'},
                  {
                    text: 'Treat yourself to a big purchase',
                    id: 'big_purchase',
                  },
                ],
              },
              {
                id: 'input',
                answerId: 'otherInput',
                type: 'textField',
                label: 'Other',
                placeholder: 'Separate each item with a comma',
                imageUrl:
                  'assets/icon/journeys/retirement/wordGroupIcons/other.svg',
              },
              {id: 'button', label: 'Continue', link: 'default'},
            ],
          },
        ],
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call processParsedAnswer', () => {
      expect(processParsedAnswerSpy).toHaveBeenCalled();
    });
  });

  describe('processParsedAnswer', () => {
    beforeEach(() => {
      processParsedAnswerSpy.and.callThrough();
      spyOn(component.valueEmpty, 'emit');
    });

    it('should parse the answer and set the imageUrl for each answer if isOther is false and the answer is not empty', () => {
      const answer = 'answer';
      const answerId = 'answerId';
      component.element = {
        answer: answer,
        answerId: answerId,
      };
      journeyServiceSpy.safeParse.and.returnValue([
        {
          id: 'id1',
          text: 'text1',
        },
        {
          id: 'id2',
          text: 'text2',
        },
        {
          id: 'id3',
          text: 'text3',
        },
      ]);

      const options = [
        {
          imageUrl: 'imageUrl1',
          id: 'id1',
          altText: 'altText1',
        },
        {
          imageUrl: 'imageUrl2',
          id: 'id2',
          altText: 'altText2',
        },
        {
          imageUrl: 'imageUrl3',
          id: 'id3',
          altText: 'altText3',
        },
      ];
      journeyServiceSpy.findElementByProp.and.returnValue({
        options: options,
      });
      component.content = content;
      component.processParsedAnswer();
      expect(journeyServiceSpy.findElementByProp).toHaveBeenCalledWith(
        content,
        'answerId',
        answerId
      );
      expect(journeyServiceSpy.safeParse).toHaveBeenCalledWith(answer);
      expect(component.parsedAnswer).toEqual([
        {
          imageUrl: 'imageUrl1',
          id: 'id1',
          text: 'text1',
          altText: 'altText1',
        },
        {
          imageUrl: 'imageUrl2',
          id: 'id2',
          text: 'text2',
          altText: 'altText2',
        },
        {
          imageUrl: 'imageUrl3',
          id: 'id3',
          text: 'text3',
          altText: 'altText3',
        },
      ]);
      expect(component.valueEmpty.emit).toHaveBeenCalledWith(false);
    });

    it('should not set the imageUrl for each answer if the answer is undefined', () => {
      const answer = 'answer';
      const answerId = 'answerId';
      component.element = {
        answer: answer,
        answerId: answerId,
      };
      journeyServiceSpy.safeParse.and.returnValue(undefined);

      const options = [
        {
          imageUrl: 'imageUrl1',
          id: 'id1',
        },
        {
          imageUrl: 'imageUrl2',
          id: 'id2',
        },
        {
          imageUrl: 'imageUrl3',
          id: 'id3',
        },
      ];
      journeyServiceSpy.findElementByProp.and.returnValue({
        options: options,
      });
      component.content = content;
      component.processParsedAnswer();

      expect(component.parsedAnswer).toBeUndefined();
      expect(component.valueEmpty.emit).toHaveBeenCalledWith(true);
    });

    it('should not set the imageUrl for each answer if the answer is the empty list', () => {
      const answer = 'answer';
      const answerId = 'answerId';
      component.element = {
        answer: answer,
        answerId: answerId,
      };
      journeyServiceSpy.safeParse.and.returnValue([]);

      const options = [
        {
          imageUrl: 'imageUrl1',
          id: 'id1',
        },
        {
          imageUrl: 'imageUrl2',
          id: 'id2',
        },
        {
          imageUrl: 'imageUrl3',
          id: 'id3',
        },
      ];
      journeyServiceSpy.findElementByProp.and.returnValue({
        options: options,
      });
      component.content = content;
      component.processParsedAnswer();

      expect(component.parsedAnswer).toEqual([]);
      expect(component.valueEmpty.emit).toHaveBeenCalledWith(true);
    });

    it('should set the one parsedAnswer if isOther is true and the answer is not empty', () => {
      const imageUrl = 'imageUrl';
      const label = 'Other';
      const answer = 'answer';
      const answerId = 'answerId';
      const altText = 'altText';
      journeyServiceSpy.findElementByProp.and.returnValue({
        imageUrl: imageUrl,
        label: label,
        altText: altText,
      });
      component.element = {
        answer: answer,
        answerId: answerId,
      };
      component.isOther = true;
      component.parsedAnswer = undefined;
      component.content = content;
      component.processParsedAnswer();
      expect(journeyServiceSpy.findElementByProp).toHaveBeenCalledWith(
        content,
        'answerId',
        answerId
      );
      expect(component.parsedAnswer).toEqual([
        {
          imageUrl: imageUrl,
          text: answer,
          id: undefined,
          label: label,
          altText: altText,
        },
      ]);
      expect(component.valueEmpty.emit).toHaveBeenCalledWith(false);
    });

    it('should not set the parsedAnswer if isOther is true and the answer is empty', () => {
      const imageUrl = 'imageUrl';
      const label = 'Other';
      const answerId = 'answerId';
      journeyServiceSpy.findElementByProp.and.returnValue({
        imageUrl: imageUrl,
        label: label,
      });
      component.element = {
        answer: '',
        answerId: answerId,
      };
      component.isOther = true;
      component.parsedAnswer = undefined;
      component.content = content;
      component.processParsedAnswer();
      expect(journeyServiceSpy.findElementByProp).toHaveBeenCalledWith(
        content,
        'answerId',
        answerId
      );
      expect(component.parsedAnswer).toBeUndefined();
      expect(component.valueEmpty.emit).toHaveBeenCalledWith(true);
    });
  });
});
