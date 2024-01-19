import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController, NavParams} from '@ionic/angular';
import {SharedUtilityService} from '../../../../services/utility/utility.service';

import {ModalComponent} from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalControllerSpy;
  let navParamsSpy;
  let utilityServiceSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      navParamsSpy = jasmine.createSpyObj('NavParams', ['get']);
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      TestBed.configureTestingModule({
        declarations: [ModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: NavParams, useValue: navParamsSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ModalComponent);
      component = fixture.componentInstance;
      component.element = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onPopState', () => {
    it('should call dismiss', () => {
      component.onPopState();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('closeDialog', () => {
    it('should call dismiss', () => {
      component.closeDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('saveValue', () => {
    it('should call the saveFunction', () => {
      const value = 'value';
      component.saveFunction = jasmine.createSpy();
      component.saveFunction(value);
      expect(component.saveFunction).toHaveBeenCalledWith(value);
    });
  });
});
