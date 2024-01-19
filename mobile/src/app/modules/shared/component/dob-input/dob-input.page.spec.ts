import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DobInputPage} from './dob-input.page';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';

describe('DOB-input page', () => {
  let component: DobInputPage;
  let fixture: ComponentFixture<DobInputPage>;
  let locationSpy: Location;
  let routerSpy: Router;

  beforeEach(async(() => {
    routerSpy = jasmine.createSpyObj('router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [DobInputPage],
      providers: [
        {provide: Location, useValue: locationSpy},
        {provide: Router, useValue: routerSpy},
      ],
      imports: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DobInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('When dateSelector will be false', () => {
      component.myDate = '';
      component.dateSelector = false;
      component.ngOnInit();
      expect(component.myDate).not.toBe('');
    });
    it('When dateSelector will be true', () => {
      component.myDate = '';
      component.dateSelector = true;
      component.ngOnInit();
      expect(component.myDate).toBe('');
    });
  });

  it('requestPin()', () => {
    component.requestPin();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      '/login/register-ssn-eid/request-new-pin'
    );
  });

  it('reset()', () => {
    component.myDate = '27/10/21';
    component.reset();
    expect(component.myDate).toEqual('');
  });

  it('sendData()', () => {
    spyOn(component.dobEvent, 'emit');
    const res = {
      value: 'str',
      status: true,
    };
    component.sendData('str', true);
    expect(component.dobEvent.emit).toHaveBeenCalledWith(res);
  });

  it('dateSelected()', () => {
    const event = {
      detail: {
        value: '26/10/2021',
      },
    };
    spyOn(component, 'sendData');
    component.labelBool = true;
    component.dateSelected(event);
    expect(component.dobLabel).toEqual(true);
    expect(component.sendData).toHaveBeenCalledWith(event.detail.value, true);
    expect(component.selectedDate).toEqual('26/10/2021');
  });
});
