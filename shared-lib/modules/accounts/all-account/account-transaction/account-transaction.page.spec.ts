import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AccountTransactionPage} from './account-transaction.page';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import { AccessService } from '@shared-lib/services/access/access.service';
import { of } from 'rxjs';
@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('AccountTransactionPage', () => {
  let component: AccountTransactionPage;
  let fixture: ComponentFixture<AccountTransactionPage>;
  let sharedUtilityServiceSpy;
  let accessServiceSpy;

  beforeEach(
    waitForAsync(() => {
      sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({
          isAltAccessUser: true,
        })
      );
      
      TestBed.configureTestingModule({
        declarations: [AccountTransactionPage, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AccountTransactionPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'checkAltAccessUser');
    });
    it('should call set height', () => {
      component.contentView = {
        nativeElement: jasmine.createSpyObj('NativeEl', [''], {
          offsetHeight: 500,
        }),
      };

      component.ngOnInit();
      expect(component.checkAltAccessUser).toHaveBeenCalled();
      expect(component.height).toEqual('530px');
    });
  });

  describe('checkAltAccessUser', () => {
    it('should call checkMyvoyageAccess', () => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(of(true));
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    let widgetSpy;
    beforeEach(() => {
      widgetSpy = jasmine.createSpyObj('Widget', ['refreshWidget']);
      component.widget = widgetSpy;
    });

    it('should set firstLoad to false if its true and not call refreshWidget', () => {
      component.firstLoad = true;

      component.ionViewWillEnter();
      expect(widgetSpy.refreshWidget).not.toHaveBeenCalled();
      expect(component.firstLoad).toBeFalse();
    });

    it('should call refreshWidget if not first load', () => {
      component.firstLoad = false;

      component.ionViewWillEnter();
      expect(widgetSpy.refreshWidget).toHaveBeenCalled();
    });
  });
});
