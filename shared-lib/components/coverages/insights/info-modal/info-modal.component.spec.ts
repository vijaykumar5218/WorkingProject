import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {InfoModalComponent} from './info-modal.component';

describe('InfoModalComponent', () => {
  let component: InfoModalComponent;
  let fixture: ComponentFixture<InfoModalComponent>;
  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
      TestBed.configureTestingModule({
        declarations: [InfoModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: ModalController, useValue: modalControllerSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(InfoModalComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeInfoDialog', () => {
    it('should close modal on click', () => {
      component.closeInfoDialog();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
