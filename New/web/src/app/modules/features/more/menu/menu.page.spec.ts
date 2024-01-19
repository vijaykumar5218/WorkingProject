import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {MenuPage} from './menu.page';
import {IonicModule} from '@ionic/angular';
import {SettingsService} from '@shared-lib/services/settings/settings.service';
import {WebLogoutService} from '@web/app/modules/shared/services/logout/logout.service';

describe('MenuPage', () => {
  let component: MenuPage;
  let fixture: ComponentFixture<MenuPage>;
  let setMenuItemsSpy;
  let settingsServiceSpy;
  let logoutServiceSpy;

  beforeEach(
    waitForAsync(() => {
      logoutServiceSpy = jasmine.createSpyObj('WebLogoutService', [
        'openModal',
      ]);
      settingsServiceSpy = jasmine.createSpyObj('SettingsService', [
        'getSettingsDisplayFlags',
      ]);
      settingsServiceSpy.getSettingsDisplayFlags.and.returnValue(
        Promise.resolve({
          displayContactLink: true,
          suppressAppointment: true,
          pwebStatementUrl:
            'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710',
        })
      );
      TestBed.configureTestingModule({
        declarations: [MenuPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SettingsService, useValue: settingsServiceSpy},
          {provide: WebLogoutService, useValue: logoutServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MenuPage);
      component = fixture.componentInstance;
      setMenuItemsSpy = spyOn(component, 'setMenuItems');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should called setMenuItems', async () => {
      await component.ngOnInit();
      expect(component.setMenuItems).toHaveBeenCalledWith({
        displayContactLink: true,
        suppressAppointment: true,
        pwebStatementUrl:
          'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710',
      });
      expect(settingsServiceSpy.getSettingsDisplayFlags).toHaveBeenCalled();
    });
  });

  describe('setMenuItems', () => {
    beforeEach(() => {
      setMenuItemsSpy.and.callThrough();
    });
    it('when displayContactLink true', () => {
      component.setMenuItems({
        displayContactLink: true,
        suppressAppointment: true,
        pwebStatementUrl:
          'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710',
      });
      expect(component.menuConfig.items.length).toEqual(8);
    });
    it('when displayContactLink false', () => {
      component.setMenuItems({
        displayContactLink: false,
        suppressAppointment: true,
        pwebStatementUrl:
          'https://my3.intg.voya.com/eportal/preauth.do?s=M3WzuDn6AZtT4YCVU6Ew4g11.i9291&page=STATEMENTS&section=myCorresPrec&d=ea6a8fd9af34f694dfa940078ee98b2f229da710',
      });
      expect(component.menuConfig.items.length).toEqual(7);
    });
  });

  it('onLogout', () => {
    component.onLogout();
    expect(logoutServiceSpy.openModal).toHaveBeenCalled();
  });
});
