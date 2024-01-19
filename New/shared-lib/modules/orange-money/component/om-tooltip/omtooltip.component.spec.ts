import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';

import {OMTooltipComponent} from './omtooltip.component';

describe('OMTooltipComponent', () => {
  let component: OMTooltipComponent;
  let fixture: ComponentFixture<OMTooltipComponent>;
  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

      TestBed.configureTestingModule({
        declarations: [OMTooltipComponent],
        providers: [{provide: ModalController, useValue: modalControllerSpy}],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(OMTooltipComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    it('should call modalController dismiss', () => {
      component.closeDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
