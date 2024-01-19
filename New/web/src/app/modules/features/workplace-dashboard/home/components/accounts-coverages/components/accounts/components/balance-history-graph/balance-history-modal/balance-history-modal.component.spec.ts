import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';

import {BalanceHistoryModalComponent} from './balance-history-modal.component';

describe('BalanceHistoryModalComponent', () => {
  let component: BalanceHistoryModalComponent;
  let fixture: ComponentFixture<BalanceHistoryModalComponent>;

  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

      TestBed.configureTestingModule({
        declarations: [BalanceHistoryModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: ModalController, useValue: modalControllerSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(BalanceHistoryModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeModal', () => {
    it('should call dismiss from modalController', () => {
      component.closeModal();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
