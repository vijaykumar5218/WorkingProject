import {Category} from './models/help.model';
import {TestBed} from '@angular/core/testing';
import {SharedUtilityService} from '../utility/utility.service';
import {HelpService} from './help.service';

describe('HelpService', () => {
  let service: HelpService;
  let sharedUtilityServiceSpy;

  beforeEach(() => {
    sharedUtilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
      'backToPrevious',
      'navigateByUrl',
    ]);
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {provide: SharedUtilityService, useValue: sharedUtilityServiceSpy},
      ],
    }).compileComponents();
    service = TestBed.inject(HelpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setCategoryData', () => {
    it('should set the categoryData', () => {
      const category: Category = {
        title: 'Category A',
        enableMyVoyage: false,
        questionList: [
          {
            question:
              'Lorem ipsum dolor sit amet, consecte tur adipiscing elit?', 
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
        ],
      };
      service.setCategoryData(category);
      expect(service.helpContent).toEqual(category);
    });
  });

  describe('getCategoryData', () => {
    it('should set the categoryData', () => {
      service.helpContent = {
        title: 'Category A',
        enableMyVoyage: false,
        questionList: [
          {
            question:
              'Lorem ipsum dolor sit amet, consecte tur adipiscing elit?',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis at non mi ipsum faucibus. Felis risus at est leo massa tincidunt at sed nec. Condimentum consectetur massa id a. Iaculis malesuada integer. In est pellentesque nisl diam metus vel et amet nibh. Nunc curabitur porttitor ipsum scelerisque. Felis ultricies varius lorem ut ultrices mi sed.Dignissim dui proin vivamus enim, nec arcu. Eget massa tellus sed id. Arcu, risus, facilisis risus, sapien pellentesque molestie. Nisi a, ut nunc urna pretium.',
          },
        ],
      };

      const result = service.getCategoryData();
      expect(result).toEqual(service.helpContent);
    });
  });

  describe('backToFaq', () => {
    it('should call backToPrevious of sharedUtilityServiceSpy', () => {
      service.backToFaq();
      expect(sharedUtilityServiceSpy.backToPrevious).toHaveBeenCalled();
    });
  });

  describe('isfocusedOnRouterOutlet', () => {
    it('should get the data', done => {
      service['focusedOnRouterOutlet'].next(true);
      service.isfocusedOnRouterOutlet().subscribe(data => {
        expect(data).toEqual(true);
        done();
      });
    });
  });

  describe('navigateToHelpContent', () => {
    it('should call navigateByUrl of sharedUtilityServiceSpy', () => {
      service.navigateToHelpContent('help-content');
      expect(sharedUtilityServiceSpy.navigateByUrl).toHaveBeenCalledWith(
        'help-content'
      );
    });
  });
});
