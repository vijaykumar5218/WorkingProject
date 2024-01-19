import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';

import {AltAccessModalComponent} from './alt-access-modal.component';

describe('AltAccessModalComponent', () => {
  let component: AltAccessModalComponent;
  let fixture: ComponentFixture<AltAccessModalComponent>;
  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('modal', ['dismiss']);
      TestBed.configureTestingModule({
        declarations: [AltAccessModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: ModalController, useValue: modalControllerSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(AltAccessModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('closeDialogClicked', () => {
    it('should close modal when closeDialogClicked is called ', () => {
      component.closeDialogClicked();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
