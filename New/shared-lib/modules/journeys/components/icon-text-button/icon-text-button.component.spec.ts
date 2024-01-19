import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '../../../../services/journey/journey.service';
import {Journey} from '../../../../services/journey/models/journey.model';
import {IconTextButtonComponent} from './icon-text-button.component';

describe('IconTextButtonComponent', () => {
  let component: IconTextButtonComponent;
  let fixture: ComponentFixture<IconTextButtonComponent>;
  let journeyServiceSpy;
  let journey: Journey;
  let serviceSpy;
  let contentLinkValue;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentJourney',
      ]);
      journey = {journeyID: 2, lastModifiedStepIndex: 2, journeyName: 'two'};
      journeyServiceSpy.getCurrentJourney.and.returnValue(journey);
      serviceSpy = jasmine.createSpyObj('JourneyService', [
        'handleEditModalValueChange',
        'getModalValue',
      ]);
      journeyServiceSpy.journeyServiceMap = {2: serviceSpy};
      contentLinkValue = {contentLink: 'value'};
      serviceSpy.getModalValue.and.returnValue(contentLinkValue);
      TestBed.configureTestingModule({
        declarations: [IconTextButtonComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(IconTextButtonComponent);
      component = fixture.componentInstance;
      component.element = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the contentLinkElement and contentLinkValue if displayEdit is true', () => {
      component.displayEdit = true;
      component.element.elements = [{id: '0', answerId: 'element0'}];
      component.contentLinkElement = undefined;
      component.contentLinkValue = undefined;
      component.element.id = 'id';
      component.ngOnInit();
      expect(component.contentLinkElement).toEqual({
        answerId: 'element0',
        id: 'editModalButton',
      });
      expect(serviceSpy.getModalValue).toHaveBeenCalledWith('id', 'element0');
      expect(component.contentLinkValue).toEqual(contentLinkValue);
    });

    it('should set the contentLinkElement and contentLinkValue to undefined if displayEdit is true but there are no elements', () => {
      component.displayEdit = true;
      component.element.elements = undefined;
      component.contentLinkElement = undefined;
      component.contentLinkValue = undefined;
      component.ngOnInit();
      expect(component.contentLinkElement).toBeUndefined();
      expect(serviceSpy.getModalValue).not.toHaveBeenCalled();
      expect(component.contentLinkValue).toBeUndefined();
    });
  });

  describe('handleClick', () => {
    it('should emit event', () => {
      spyOn(component.clickEvent, 'emit');
      component.handleClick();
      expect(component.clickEvent.emit).toHaveBeenCalled();
    });
  });

  describe('emitEditClick', () => {
    it('should emit event', () => {
      spyOn(component.editClick, 'emit');
      component.emitEditClick();
      expect(component.editClick.emit).toHaveBeenCalled();
    });
  });

  describe('handleValueChange', () => {
    let value;

    beforeEach(() => {
      value = 'value';
      spyOn(component.updateStepValueAndStep, 'emit');
      component.contentLinkElement = {answerId: 'answerId'};
    });

    it('should emit updateStepValueAndStep', () => {
      component.handleValueChange(value);
      expect(component.updateStepValueAndStep.emit).toHaveBeenCalled();
    });

    it('should call handleEditModalValueChange', () => {
      component.index = 3;
      component.handleValueChange(value);
      expect(serviceSpy.handleEditModalValueChange).toHaveBeenCalledWith(
        value,
        3
      );
    });

    it('should set contentLinkValue with the result of getModalValue', () => {
      component.element.id = 'id';
      component.contentLinkValue = undefined;
      component.handleValueChange(value);
      expect(serviceSpy.getModalValue).toHaveBeenCalledWith('id', 'answerId');
      expect(component.contentLinkValue).toEqual(contentLinkValue);
    });
  });
});
