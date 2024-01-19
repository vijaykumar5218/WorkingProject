import {of} from 'rxjs';
import {AccountInfoService} from '@shared-lib/services/account-info/account-info.service';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {HelpPage} from './help.page';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import { AccessService } from '@shared-lib/services/access/access.service';

describe('HelpPage', () => {
  let component: HelpPage;
  let fixture: ComponentFixture<HelpPage>;
  let headerTypeServiceSpy;
  let accountInfoServiceSpy;
  let getMenuSpy;
  let utilityServiceSpy;
  let accessServiceSpy;
  const message = {
    HelpPageJSON:
      '{"pageHeader":"Help","categoryList":[{"category":{"title":"Category A","questionList":[{"question":"How do to find my loans?","description":"How to find my loans"}]}},{"category":{"title":"Category B","questionList":[{"question":"How do to find my loans?","description":"How to find my loans"}]}}]}',
  };

  const drupal = {
    DesktopHelpPageFAQs:
      '{"pageHeader":"Help","categoryList":[{"category":{"title":"Category A","enableMyVoyage":false,"questionList":[{"question":"How do to find my loans?","description":"How to find my loans"}]}},{"category":{"title":"Category B","questionList":[{"question":"How do to find my loans?","description":"How to find my loans"}]}}]}',
  };


    beforeEach(
    waitForAsync(() => {
      utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getIsWeb']);
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      accountInfoServiceSpy = jasmine.createSpyObj('AccountInfoService', [
        'getScreenMessage',
      ]);
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({enableMyVoyage: 'Y'})
      );

      TestBed.configureTestingModule({
        declarations: [HelpPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: AccountInfoService, useValue: accountInfoServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HelpPage);
      component = fixture.componentInstance;
      getMenuSpy = spyOn(component, 'getMenuItems');
      fixture.detectChanges();
      component.moreContentSubscription = jasmine.createSpyObj('Subscription', [
        'unsubscribe',
      ]);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call the getMenuItem and getIsWeb function', () => {
      component.ngOnInit();
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(getMenuSpy).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Help',
        btnleft: true,
        btnright: true,
        buttonLeft: {
          name: '',
          link: 'settings',
        },
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };
      component.ionViewWillEnter();
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
    });
  });

  describe('getMenuItems', () => {
    beforeEach(() => {
      getMenuSpy.and.callThrough();
      accountInfoServiceSpy.getScreenMessage.and.returnValue(of(message));
      spyOn(component, 'setMenuItems');
    });

    it('should call getScreenMessage from accountInfoService and return message', () => {
      component.getMenuItems();
      expect(accountInfoServiceSpy.getScreenMessage).toHaveBeenCalled();
      expect(component.options).toEqual(JSON.parse(message.HelpPageJSON));
      expect(component.setMenuItems).toHaveBeenCalled();
    });
    it('should call getScreenMessage from accountInfoService and return message when isWeb is true', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      accountInfoServiceSpy.getScreenMessage.and.returnValue(of(drupal));
      component.isWeb =true;
      component.getMenuItems();
      expect(component.isWeb).toBeTrue();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(accountInfoServiceSpy.getScreenMessage).toHaveBeenCalled();
      expect(component.options).toEqual(JSON.parse(drupal.DesktopHelpPageFAQs));
    });
  });

  describe('setMenuItems', () => {
    let config;
    let helpJson;
    beforeEach(() => {
      config = {items: []};
      helpJson = JSON.parse(message.HelpPageJSON);
      const categoryList = helpJson.categoryList;
      for (const option of categoryList) {
        config.items.push({
          text: option.category.title,
          route: '/settings/help/help-content',
          category: option.category,
        });
      }
    });

    it('should set menuConfig when menuConfig is empty', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.menuConfig = {items: []};
      component.options = helpJson;
      component.setMenuItems();
      expect(component.menuConfig).toEqual(config);
    });

    it('should not set menuConfig when menuConfig is not empty', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(false);
      component.options = helpJson;
      component.menuConfig = config;
      component.setMenuItems();
      expect(component.menuConfig).toEqual(config);
    });
  });

  describe('setMenuItems', () => {
    let config;
    let helpJson;
    let enableMyVoyage;
    beforeEach(() => {
      config = {items: []};
      helpJson = JSON.parse(message.HelpPageJSON);
      const categoryList = helpJson.categoryList;
      for (const option of categoryList) {
        config.items.push({
          text: option.category.title,
          route: '/more/help/help-content',
          category: option.category,
            enableMyVoyage:
              option.category?.enableMyVoyage === undefined? true: enableMyVoyage,
        });
      }
    });

    it('should set menuConfig when menuConfig is empty', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.menuConfig = {items: []};
      component.options = helpJson;
      component.setMenuItems();
      expect(component.menuConfig.items[0].enableMyVoyage).toEqual(true);
      expect(component.menuConfig).toEqual(config);
    });

    it('should not set menuConfig when menuConfig is not empty', () => {
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.options = helpJson;
      component.menuConfig = config;
      component.setMenuItems();
      expect(component.menuConfig).toEqual(config);
      
    });
  });
  
  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component.moreContentSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
