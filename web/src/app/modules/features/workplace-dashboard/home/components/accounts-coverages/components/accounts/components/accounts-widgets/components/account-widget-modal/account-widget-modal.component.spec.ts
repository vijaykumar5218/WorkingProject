import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AccountWidgetModal} from './account-widget-modal.component';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {AccountService} from '@shared-lib/services/account/account.service';

@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('ModalComponent', () => {
  let component: AccountWidgetModal;
  let fixture: ComponentFixture<AccountWidgetModal>;
  let sharedUtilityServiceSpy;
  let modalControllerSpy;
  let mxServiceSpy;
  let accountServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'setSuppressHeaderFooter',
      ]);

      modalControllerSpy = jasmine.createSpyObj('ModalControllerSpy', [
        'dismiss',
      ]);
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'getMxMemberConnect',
        'getMxAccountConnect',
        'getUserAccountUpdate',
        'addMXWindowEventListener',
        'removeMXWindowEventListener',
      ]);
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getAggregatedAccounts'
      ]);

      TestBed.configureTestingModule({
        declarations: [AccountWidgetModal, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: AccountService, useValue: accountServiceSpy}
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountWidgetModal);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewDidEnter', () => {
    it('should load mx widget and call mx service addMXWindowEventListener', () => {
      component.ionViewDidEnter();
      expect(mxServiceSpy.addMXWindowEventListener).toHaveBeenCalled();
    });
  });

  describe('ionViewWillLeave', () => {
    it('should refresh mx manage data', () => {
      component.ionViewWillLeave();
      expect(mxServiceSpy.getMxMemberConnect).toHaveBeenCalledWith(true);
    });
    it('should refresh mx manage account linked data', () => {
      component.ionViewWillLeave();
      expect(mxServiceSpy.getMxAccountConnect).toHaveBeenCalledWith(true);
    });
    it('should refresh/fetch AggregatedAccounts data', () => {
      component.ionViewWillLeave();
      expect(accountServiceSpy.getAggregatedAccounts).toHaveBeenCalledWith(mxServiceSpy.getUserAccountUpdate());
    });
    it('should call mx service removeMXWindowEventListener', () => {
      component.ionViewWillLeave();
      expect(mxServiceSpy.removeMXWindowEventListener).toHaveBeenCalled();
    });
  });

  describe('closeModal', () => {
    it('should call setSuppressHeaderFooter with false and call dismiss', () => {
      component.closeModal();
      expect(
        sharedUtilityServiceSpy.setSuppressHeaderFooter
      ).toHaveBeenCalledWith(false);
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
