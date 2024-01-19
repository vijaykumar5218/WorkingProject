import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HeaderComponent} from './header.component';
import {of} from 'rxjs';
import {Component, Input} from '@angular/core';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

@Component({selector: 'app-navbar', template: ''})
class MockNavbar {
  @Input() actionOption;
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let headerTypeServiceSpy;
  let headerInfo;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'createSubscriber',
      ]);
      headerInfo = {type: HeaderType.navbar};
      headerTypeServiceSpy.createSubscriber.and.returnValue(of(headerInfo));
      TestBed.configureTestingModule({
        declarations: [HeaderComponent, MockNavbar],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
        ],
        imports: [RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call createSubscriber', () => {
      expect(headerTypeServiceSpy.createSubscriber).toHaveBeenCalled();
    });

    it('should initialize info if type is passed in', () => {
      expect(component.info).toEqual(headerInfo);
    });

    it('should not initialize info if type is not passed in', () => {
      headerInfo = {};
      headerTypeServiceSpy.createSubscriber.and.returnValue(of(headerInfo));
      component.info = undefined;
      component.ngOnInit();
      expect(component.info).toBeUndefined();
    });
  });
});
