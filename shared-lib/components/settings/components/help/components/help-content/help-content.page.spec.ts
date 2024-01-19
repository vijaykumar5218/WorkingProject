import {Category} from '@shared-lib/services/help/models/help.model';
import {HelpService} from '@shared-lib/services/help/help.service';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';
import {HelpContentPage} from './help-content.page';
import {of} from 'rxjs';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';
import {AccessService} from '@shared-lib/services/access/access.service';

describe('HelpContentPage', () => {
  let component: HelpContentPage;
  let fixture: ComponentFixture<HelpContentPage>;
  let headerTypeServiceSpy;
  let helpServiceSpy;
  let platformServiceSpy;
  let utilityServiceSpy;
  let accessServiceSpy;
  const mockAccessData = {
    clientId: 'KOHLER',
    clientDomain: 'kohler.intg.voya.com',
    clientName: 'Kohler Co. 401(k) Savings Plan',
    planIdList: [
      {
        planId: '623040',
        active: true,
        benefitsAdminSystem: 'ADP',
      },
    ],
    firstTimeLogin: false,
    platform: 'ADP',
    currentPlan: {
      planId: '623040',
      active: true,
      benefitsAdminSystem: 'ADP',
    },
    enableMX: 'Y',
    isHealthOnly: false,
    myProfileURL: 'https%3A%2F%2Flogin.intg.voya',
  };

  beforeEach(
    waitForAsync(() => {
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'checkMyvoyageAccess',
      ]);
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve(null)
      );
      platformServiceSpy = jasmine.createSpyObj('PlatformService', [
        'isDesktop',
      ]);
      platformServiceSpy.isDesktop.and.returnValue(of(true));
      utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
        'getIsWeb',
      ]);
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      helpServiceSpy = jasmine.createSpyObj('HelpService', [
        'setCategoryData',
        'getCategoryData',
        'backToFaq',
      ]);
      TestBed.configureTestingModule({
        declarations: [HelpContentPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: HelpService, useValue: helpServiceSpy},
          {provide: SharedUtilityService, useValue: utilityServiceSpy},
          {provide: PlatformService, useValue: platformServiceSpy},
          {provide: AccessService, useValue: accessServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HelpContentPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    let category: Category;
    beforeEach(() => {
      category = {
        title: 'Category A',
        questionList: [
          {
            question:
              'Lorem ipsum dolor sit amet, consecte tur adipiscing elit?',
              enableMyVoyage: true,
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
          {
            question: 'Quis sollicitudin faucibus ultrices?',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
          {
            question:
              'Lorem ipsum dolor sit amet, con sec tetur adipiscing elit. Lobortis massa pellentesque nunc venenatis orci at non scelerisque vulputate?',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
          {
            question:
              'Lorem ipsum dolor sit amet, c sectetur adipiscing elit ed aliquam nulla neque, viverra et imperdiet?',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
          {
            question:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor porta urna condimentum amet nunc praesent ultricies gravida. ',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
        ],
      };
    });
    it(' should publish header and get categorydata', async() => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({...mockAccessData, ...{enableMyVoyage: 'Y'}, ...{myWorkplaceDashboardEnabled: true}})
      );
      const actionOption: ActionOptions = {
        headername: category.title,
        btnleft: true,
        btnright: true,
        buttonLeft: {
          name: '',
          link: 'settings/help',
        },
        buttonRight: {
          name: '',
          link: 'notification',
        },
      };

      helpServiceSpy.getCategoryData.and.returnValue(category);
      utilityServiceSpy.getIsWeb.and.returnValue(true);
      component.isWeb = true;
      await component.ionViewWillEnter();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.enableMyVoyage).toEqual(true);
      expect(component.myWorkplaceDashboardEnabled).toEqual(true);
      expect(component.category).toEqual(category);
      expect(component.isWeb).toBeTrue();
      expect(utilityServiceSpy.getIsWeb).toHaveBeenCalled();
      expect(component.actionOption.headername).toEqual(category.title);
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith({
        type: HeaderType.navbar,
        actionOption: actionOption,
      });
    });
    it(' should publish header and get categorydata', async() => {
      accessServiceSpy.checkMyvoyageAccess.and.returnValue(
        Promise.resolve({...mockAccessData, ...{enableMyVoyage: 'N'}, ...{myWorkplaceDashboardEnabled: false}})
      );
      category = {
        title: 'Category A',
        questionList: [
          {
            question:
              'Lorem ipsum dolor sit amet, consecte tur adipiscing elit?',
              enableMyVoyage: false,
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
          {
            question: 'Quis sollicitudin faucibus ultrices?',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
          {
            question:
              'Lorem ipsum dolor sit amet, con sec tetur adipiscing elit. Lobortis massa pellentesque nunc venenatis orci at non scelerisque vulputate?',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
          {
            question:
              'Lorem ipsum dolor sit amet, c sectetur adipiscing elit ed aliquam nulla neque, viverra et imperdiet?',

            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
          {
            question:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor porta urna condimentum amet nunc praesent ultricies gravida. ',
            description:

              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
        ],
      };
      helpServiceSpy.getCategoryData.and.returnValue(category);
      await component.ionViewWillEnter();
      expect(accessServiceSpy.checkMyvoyageAccess).toHaveBeenCalled();
      expect(component.enableMyVoyage).toEqual(false);
      expect(component.myWorkplaceDashboardEnabled).toEqual(false);
      expect(component.category).toEqual(category);
      expect(component.actionOption.headername).toEqual(category.title);
    });
  });

  it('navigateTo', () => {
    component.navigateTo();
    expect(helpServiceSpy.backToFaq).toHaveBeenCalled();
  });
});