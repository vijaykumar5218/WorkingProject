import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {AddAccountModalComponent} from './add-account-modal.component';
import {AccountService} from '@shared-lib/services/account/account.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {AddAccountsPage} from '@shared-lib/modules/accounts/add-accounts/add-accounts.page';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

describe('AddAccountModalComponent', () => {
  let component: AddAccountModalComponent;
  let fixture: ComponentFixture<AddAccountModalComponent>;
  let accountServiceSpy;
  let utilityServiceSpy;
  let getAddAccountModalDataSpy;
  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('accountServiceSpy', [
        'getAddAcctModalContent',
      ]);
      utilityServiceSpy = jasmine.createSpyObj('utilityServiceSpy', [
        'setSuppressHeaderFooter',
      ]);
      modalControllerSpy = jasmine.createSpyObj('modalControllerSpy', [
        'create',
        'dismiss',
      ]);
      TestBed.configureTestingModule({
        declarations: [AddAccountModalComponent],
        providers: [
          {provide: AccountService, useValue: accountServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule, IonicModule.forRoot()],
      }).compileComponents();
      fixture = TestBed.createComponent(AddAccountModalComponent);
      component = fixture.componentInstance;
      getAddAccountModalDataSpy = spyOn(component, 'getAddAccountModalData');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getAddAccountModalData', () => {
      component.ngOnInit();
      expect(getAddAccountModalDataSpy).toHaveBeenCalled();
    });
  });

  describe('getAddAccountModalData', () => {
    let mockFilterModelData;
    beforeEach(() => {
      getAddAccountModalDataSpy.and.callThrough();
      mockFilterModelData = {
        addAccount: {
          title: 'Adding Accounts',
          subtitle: 'Lorem ipsum dolor sit amet consectetur. Suspendisse',
          benefits: {
            title: 'Benefits:',
            list: [
              {text: 'Organize your financial life'},
              {
                text:
                  'Organize your financial life Get insights on your spending habits to manage your expenses and create a budget',
              },
            ],
          },
          usefulInfo: {
            title: 'Useful information to have on hand:',
            list: [{text: 'Account username'}, {text: 'Password'}],
          },
          button: {
            text: 'Add Account',
          },
        },
      };
      component.content = undefined;
    });

    it('should set content', async () => {
      accountServiceSpy.getAddAcctModalContent.and.returnValue(
        mockFilterModelData
      );
      await component.getAddAccountModalData();
      expect(accountServiceSpy.getAddAcctModalContent).toHaveBeenCalled();
      expect(component.content).toEqual(mockFilterModelData);
    });
  });

  describe('openAddAccountWidgetModal', () => {
    let modalSpy;
    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('modalSpy', ['present']);
      modalSpy.present.and.returnValue(Promise.resolve(true));
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      spyOn(component, 'closeModal');
    });
    it('should call setSuppressHeaderFooter, closeModal', () => {
      component.openAddAccountWidgetModal();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        true
      );
      expect(component.closeModal).toHaveBeenCalled();
    });
    it('should create & present modal', async () => {
      await component.openAddAccountWidgetModal();
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: AddAccountsPage,
        cssClass: 'modal-fullscreen',
        componentProps: {
          showCancel: true,
          preInitHeight: '530px',
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });

  describe('closeModal', () => {
    it('should call setSuppressHeaderFooter & modalController dismiss', () => {
      component.closeModal();
      expect(utilityServiceSpy.setSuppressHeaderFooter).toHaveBeenCalledWith(
        false
      );
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
