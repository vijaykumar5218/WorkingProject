import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {CarouselPage} from './carousel.page';

import {AccountService} from '@shared-lib/services/account/account.service';

describe('CarouselPage', () => {
  let component: CarouselPage;
  let fixture: ComponentFixture<CarouselPage>;
  let accountServiceSpy;
  let fetchDataSpy;
  let fetchPredictSpy;

  beforeEach(
    waitForAsync(() => {
      accountServiceSpy = jasmine.createSpyObj('AccountService', [
        'getOffercode',
        'getCarouselData',
      ]);

      TestBed.configureTestingModule({
        declarations: [CarouselPage],
        imports: [IonicModule.forRoot()],
        providers: [{provide: AccountService, useValue: accountServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(CarouselPage);
      component = fixture.componentInstance;
      fetchDataSpy = spyOn(component, 'getOfferCodeValue');
      fetchPredictSpy = spyOn(component, 'getpredictValue');

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getpredictValue', () => {
      component.ngOnInit();
      expect(component.getpredictValue).toHaveBeenCalled();
    });

    it('should call getOfferCodeValue', () => {
      component.ngOnInit();
      expect(component.getOfferCodeValue).toHaveBeenCalled();
    });
  });

  describe('getOfferCodeValue', () => {
    let offerData;
    beforeEach(() => {
      fetchDataSpy.and.callThrough();
      offerData = [
        {
          title: 'Organize Your $$$',
          offerCode: 'DIVMA',
          messageType: 'MESSAGE',
        },
        {title: 'Save More', offerCode: 'INCCONT', messageType: 'MESSAGE'},
        {
          title: 'Diversification',
          offerCode: 'MANACCT',
          messageType: 'MESSAGE',
        },
      ];
    });

    it('should load offerCode', async () => {
      accountServiceSpy.getOffercode.and.returnValue(
        Promise.resolve(offerData)
      );
      component.offerVal = undefined;
      await component.getOfferCodeValue();
      expect(accountServiceSpy.getOffercode).toHaveBeenCalled();
      expect(component.offerVal).toEqual([offerData[0], offerData[1]]);
    });

    it('should offerVal would be undefined', async () => {
      accountServiceSpy.getOffercode.and.returnValue(Promise.resolve(null));
      component.offerVal = undefined;
      await component.getOfferCodeValue();
      expect(component.offerVal).toEqual(undefined);
    });
  });

  describe('getpredictValue', () => {
    let carouselData;
    beforeEach(() => {
      fetchPredictSpy.and.callThrough();
      carouselData = {
        CATCHUP: {
          icon: '',
          messages: [
            'Need to make up for lost time? ',
            'You are in the right place. Because you are eligib…to put away $6,500 more this year for retirement.',
          ],
          link_name: 'Learn More',
          link_url: '',
        },
        DIVERSE: {
          icon: '',
          messages: [
            'The right mix today could mean the right retirement for tomorrow',
            'Your investment elections might need some attentio…rrent selections to make sure you’re diversified.',
          ],
          link_name: 'Learn More',
          link_url: '',
        },
        DIVFE: {
          icon: '',
          messages: [
            'How are you investing for tomorrow?',
            'Make sure you have the right mix of investments in… advice services can help you decide. Get Started',
          ],
          link_name: 'Learn More',
          link_url: '',
        },
        DIVMA: {
          icon: '',
          messages: [
            'How are you investing for tomorrow?',
            'Make sure you have the right mix of investments in… advice services can help you decide. Get Started',
          ],
          link_name: 'Learn More',
          link_url: '',
        },
        INCCONT: {
          icon: '',
          messages: [
            'Saving 1% more today may make a difference for tomorrow',
            'One penny on the dollar may not seem like a lot, b…t forget that small changes can add up over time.',
          ],
          link_name: 'Learn More',
          link_url: '',
        },
        RESAVING: {
          icon: '',
          messages: [
            'Help get your retirement savings back on track',
            'Life happens, and sometimes your financial future …ou and get your retirement savings back on track.',
          ],
          link_name: 'Restart Your Savings',
          link_url: '',
        },
        ROLLIN: {
          icon: '',
          messages: [
            'Thinking of consolidating your retirement accounts?',
            'Your money might be simpler to manage when it’s to…ions to decide if consolidating is right for you.',
          ],
          link_name: 'Learn More',
          link_url: '',
        },
        ROLLOVER: {
          icon: '',
          messages: [
            'Is your retirement savings on pause?',
            'Your money might be simpler to manage when it’s to…ng over your retirement savings is right for you.',
          ],
          link_name: 'Learn More',
          link_url: '',
        },
      };

      accountServiceSpy.getCarouselData.and.returnValue(
        Promise.resolve(carouselData)
      );
    });

    it('should load carouselData', async () => {
      component.textPredval = undefined;
      await component.getpredictValue();
      expect(accountServiceSpy.getCarouselData).toHaveBeenCalled();
      expect(component.textPredval).toEqual(carouselData);
    });
  });
});
