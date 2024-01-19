import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {InAppBroserService} from '@mobile/app/modules/shared/service/in-app-browser/in-app-browser.service';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';
import {IntroComponent} from './intro.component';
import {of} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

describe('IntroComponent', () => {
  let component: IntroComponent;
  let fixture: ComponentFixture<IntroComponent>;
  let setDescStringsSpy;
  let regularElement;
  let webviewElement;
  let inAppBrowserSpy;
  let journeyServiceSpy;
  let journeyUtiltyServiceSpy;
  let sanitizerSpy;

  beforeEach(
    waitForAsync(() => {
      inAppBrowserSpy = jasmine.createSpyObj('InAppBroserService', [
        'openInAppBrowser',
      ]);
      journeyServiceSpy = jasmine.createSpyObj(
        'JourneyService',
        ['openModal', 'getCurrentJourney'],
        {
          journeyServiceMap: {
            1: {
              valueChange: of(),
            },
          },
        }
      );
      journeyUtiltyServiceSpy = jasmine.createSpyObj('JourneyUtilityService', [
        'processInnerHTMLData',
      ]);
      sanitizerSpy = jasmine.createSpyObj('DomSanitizer', [
        'bypassSecurityTrustHtml',
      ]);
      TestBed.configureTestingModule({
        declarations: [IntroComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: InAppBroserService, useValue: inAppBrowserSpy},
          {provide: JourneyService, useValue: journeyServiceSpy},
          {provide: JourneyUtilityService, useValue: journeyUtiltyServiceSpy},
          {proivde: DomSanitizer, useValue: sanitizerSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(IntroComponent);
      component = fixture.componentInstance;
      setDescStringsSpy = spyOn(component, 'setDescStrings');
      regularElement = {
        id: 'intro',
        header: 'header',
        description: 'description',
      };
      webviewElement = {
        id: 'intro',
        header: 'Social Security',
        description:
          'Did you know your Social Security benefit amount depends on when you decide to apply? webview{ssa.gov} Hint: the longer you wait, the larger your benefit will be. Start by setting up your account at webview{ssa.gov2}',
        webviewLinks: ['https://www.ssa.gov', 'https://www.ssa.gov2'],
        webviewHeaders: ['ssa.gov', 'ssa.gov2'],
        webviewToolbars: [false, true],
        idSuffix: 'idSuffixWebview',
      };
      component.element = regularElement;
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

    it('should not subscribe to value change if there are elements but no header', () => {
      component.element.header = null;
      component.ngOnInit();
      expect(
        journeyServiceSpy.journeyServiceMap[1].valueChange.subscribe
      ).not.toHaveBeenCalled();
    });

    it('should not subscribe to value change if there are no elements', () => {
      component.ngOnInit();
      expect(
        journeyServiceSpy.journeyServiceMap[1].valueChange.subscribe
      ).not.toHaveBeenCalled();
    });

    it('should subscribe to value change and call processInnerHTMLData if there are elements', () => {
      component.element.elements = [];
      journeyServiceSpy.journeyServiceMap[1].valueChange.subscribe.and.callFake(
        f => f(1)
      );
      component['processInnerHTMLData'] = jasmine.createSpy();
      journeyServiceSpy.getCurrentJourney.and.returnValue({journeyID: 1});
      component['checkAndSetDescStrings'] = jasmine.createSpy();
      component.ngOnInit();
      expect(journeyServiceSpy.getCurrentJourney).toHaveBeenCalled();
      expect(
        journeyServiceSpy.journeyServiceMap[1].valueChange.subscribe
      ).toHaveBeenCalled();
      expect(component['checkAndSetDescStrings']).toHaveBeenCalled();
      expect(component['processInnerHTMLData']).toHaveBeenCalledWith(1);
    });

    it('should call setDescStrings', () => {
      expect(setDescStringsSpy).toHaveBeenCalledWith('description');
    });

    it('should call setDescStrings for each of the descriptions and set listDescStrings if list is passed', () => {
      component.listDescStrings = undefined;
      setDescStringsSpy.and.callFake((str: string) => [{text: str}]);
      component.element.description = undefined;
      component.element.descriptions = ['a', 'b', 'c'];
      component.ngOnInit();
      expect(setDescStringsSpy).toHaveBeenCalledWith('a');
      expect(setDescStringsSpy).toHaveBeenCalledWith('b');
      expect(setDescStringsSpy).toHaveBeenCalledWith('c');
      expect(component.listDescStrings).toEqual([
        [{text: 'a'}],
        [{text: 'b'}],
        [{text: 'c'}],
      ]);
    });

    it('should call setDescStrings for both description and descriptions if both are passed', () => {
      component.descStrings = undefined;
      component.listDescStrings = undefined;
      setDescStringsSpy.and.callFake((str: string) => [{text: str}]);
      component.element.descriptions = ['a', 'b', 'c'];
      component.ngOnInit();
      expect(setDescStringsSpy).toHaveBeenCalledWith('description');
      expect(setDescStringsSpy).toHaveBeenCalledWith('a');
      expect(setDescStringsSpy).toHaveBeenCalledWith('b');
      expect(setDescStringsSpy).toHaveBeenCalledWith('c');
      expect(component.descStrings).toEqual([{text: 'description'}]);
      expect(component.listDescStrings).toEqual([
        [{text: 'a'}],
        [{text: 'b'}],
        [{text: 'c'}],
      ]);
    });
  });

  describe('setDescStrings', () => {
    beforeEach(() => {
      setDescStringsSpy.and.callThrough();
    });

    it('should return the descStrings for webview only description', () => {
      component.element = webviewElement;
      const result = component.setDescStrings(component.element.description);
      expect(result).toEqual([
        {
          text:
            'Did you know your Social Security benefit amount depends on when you decide to apply? ',
        },
        {
          text: 'ssa.gov',
          link: 'https://www.ssa.gov',
          header: 'ssa.gov',
          id: 'journeyWebviewLink0idSuffixWebview',
          toolbar: false,
        },
        {
          text:
            ' Hint: the longer you wait, the larger your benefit will be. Start by setting up your account at ',
        },
        {
          text: 'ssa.gov2',
          link: 'https://www.ssa.gov2',
          header: 'ssa.gov2',
          id: 'journeyWebviewLink1idSuffixWebview',
          toolbar: true,
        },
      ]);
    });

    it('should set header to empty string if webviewHeaders is not there', () => {
      component.element = webviewElement;
      component.element.webviewHeaders = undefined;
      const result = component.setDescStrings(component.element.description);
      expect(result).toEqual([
        {
          text:
            'Did you know your Social Security benefit amount depends on when you decide to apply? ',
        },
        {
          text: 'ssa.gov',
          link: 'https://www.ssa.gov',
          header: '',
          id: 'journeyWebviewLink0idSuffixWebview',
          toolbar: false,
        },
        {
          text:
            ' Hint: the longer you wait, the larger your benefit will be. Start by setting up your account at ',
        },
        {
          text: 'ssa.gov2',
          link: 'https://www.ssa.gov2',
          header: '',
          id: 'journeyWebviewLink1idSuffixWebview',
          toolbar: true,
        },
      ]);
    });

    it('should return the descStrings for video only description', () => {
      component.element = webviewElement;
      const description = 'video with video{video text}';
      component.element.description = description;
      component.element.videoUrls = ['url1'];
      component.element.playerIds = ['id1'];
      const result = component.setDescStrings(component.element.description);
      expect(result).toEqual([
        {
          text: 'video with ',
        },
        {
          text: 'video text',
          videoUrl: 'url1',
          playerId: 'id1',
          id: 'journeyVideoLink0idSuffixWebview',
        },
      ]);
    });

    it('should set the descStrings for video, webview and appLink description', () => {
      component.element = webviewElement;
      const description =
        webviewElement.description +
        'video{video text} some more text and appLink{appLink text} an appLink';
      component.element.description = description;
      component.element.videoUrls = ['url1'];
      component.element.playerIds = ['id1'];
      component.element.appLinks = ['link1'];
      const result = component.setDescStrings(component.element.description);
      expect(result).toEqual([
        {
          text:
            'Did you know your Social Security benefit amount depends on when you decide to apply? ',
        },
        {
          text: 'ssa.gov',
          link: 'https://www.ssa.gov',
          header: 'ssa.gov',
          id: 'journeyWebviewLink0idSuffixWebview',
          toolbar: false,
        },
        {
          text:
            ' Hint: the longer you wait, the larger your benefit will be. Start by setting up your account at ',
        },
        {
          text: 'ssa.gov2',
          link: 'https://www.ssa.gov2',
          header: 'ssa.gov2',
          id: 'journeyWebviewLink1idSuffixWebview',
          toolbar: true,
        },
        {
          text: '',
        },
        {
          text: 'video text',
          videoUrl: 'url1',
          playerId: 'id1',
          id: 'journeyVideoLink0idSuffixWebview',
        },
        {
          text: ' some more text and ',
        },
        {
          text: 'appLink text',
          appLink: 'link1',
          id: 'journeyAppLink0idSuffixWebview',
        },
        {
          text: ' an appLink',
        },
      ]);
    });

    it('should return the descStrings with just the text when webview, video and appLink are not present', () => {
      component.element = regularElement;
      const result = component.setDescStrings(regularElement.description);
      expect(result).toEqual([{text: 'description'}]);
    });
  });

  describe('processInnerHTMLData', () => {
    beforeEach(() => {
      component['sanitizer'] = sanitizerSpy;
      component.headerValueSafe = undefined;
      component.descStrings = [
        {
          text: 'Amount {0} in year {1}',
        },
      ];
    });
    it('should call journeyuitlityservice to get replaced label', () => {
      const label = 'label {2} with dynamic {0} values {1}';
      const elements = [
        {answerId: 'answerId1', bold: true},
        {answerId: 'answerId2', type: 'dollar', bold: true},
        {answerId: 'answerId3', type: 'dollar'},
      ];
      component.element = {
        header: label,
        elements: elements,
      };
      const replacedLabel = 'replacedLabel';
      journeyUtiltyServiceSpy.processInnerHTMLData.and.returnValue(
        replacedLabel
      );
      sanitizerSpy.bypassSecurityTrustHtml.and.returnValue(replacedLabel);
      component['processInnerHTMLData'](5);
      expect(journeyUtiltyServiceSpy.processInnerHTMLData).toHaveBeenCalledWith(
        label,
        elements,
        5
      );
      expect(sanitizerSpy.bypassSecurityTrustHtml).toHaveBeenCalledWith(
        replacedLabel
      );
      expect(component.headerValueSafe).toEqual(replacedLabel);
      expect(component.descStrings[0].textSafe).toEqual(replacedLabel);
    });
    it('should call processInnerHTMLData but not ', () => {
      const label = 'label {2} with dynamic {0} values {1}';
      const elements = [
        {answerId: 'answerId1', bold: true},
        {answerId: 'answerId2', type: 'dollar', bold: true},
        {answerId: 'answerId3', type: 'dollar'},
      ];
      component.element = {
        header: label,
        elements: elements,
      };
      const replacedLabel = 'replacedLabel';
      journeyUtiltyServiceSpy.processInnerHTMLData.and.returnValue(
        replacedLabel
      );
      sanitizerSpy.bypassSecurityTrustHtml.and.returnValue(replacedLabel);
      component.descStrings = [];
      component['processInnerHTMLData'](5);
      expect(component.descStrings.length).toEqual(0);
      expect(sanitizerSpy.bypassSecurityTrustHtml).toHaveBeenCalledOnceWith(
        replacedLabel
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
