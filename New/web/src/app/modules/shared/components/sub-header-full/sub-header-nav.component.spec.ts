import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {SubHeaderNavComponent} from './sub-header-nav.component';
import {Location} from '@angular/common';

describe('SubHeaderNavComponent', () => {
  let component: SubHeaderNavComponent;
  let fixture: ComponentFixture<SubHeaderNavComponent>;
  let locationSpy;

  beforeEach(
    waitForAsync(() => {
      locationSpy = jasmine.createSpyObj('Location', ['back']);

      TestBed.configureTestingModule({
        declarations: [SubHeaderNavComponent],
        providers: [{provide: Location, useValue: locationSpy}],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SubHeaderNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      component.id = undefined;
    });
    it('when id would not be undefined', () => {
      component.ngOnChanges({
        headerName: {
          currentValue: 'Net Worth',
          previousValue: undefined,
          firstChange: undefined,
          isFirstChange: undefined,
        },
      });
      expect(component.id).toEqual('Net-Worth');
    });
    it('when id would be undefined', () => {
      component.ngOnChanges({
        headerName: {
          currentValue: undefined,
          previousValue: undefined,
          firstChange: undefined,
          isFirstChange: undefined,
        },
      });
      expect(component.id).toEqual(undefined);
    });
  });

  describe('goBack', () => {
    it('should call location.back', () => {
      component.goBack();
      expect(locationSpy.back).toHaveBeenCalled();
    });
  });
});
