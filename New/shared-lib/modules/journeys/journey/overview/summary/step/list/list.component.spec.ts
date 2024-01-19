import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ListComponent} from './list.component';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'openWebView',
      ]);
      TestBed.configureTestingModule({
        declarations: [ListComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(ListComponent);
      component = fixture.componentInstance;
      component.element = {
        id: 'list',
        label: 'Did you know?',
        imageUrl: 'assets/icon/journeys/hsa/Message.svg',
        descImageUrl: 'assets/icon/journeys/hsa/didKnow.svg',
        marginBottom: '52px',
        elements: [
          {
            id: 'text-link',
            label: 'HSAs can even help with saving for retirement. ',
            link:
              'https://www.voya.com/article/five-hsa-benefits-you-might-not-know-about',
            altText: 'Learn More',
          },
          {
            id: 'text-link',
            label:
              'If you’ve saved enough in your HSA that you can invest it? ',
            link:
              'https://www.voya.com/article/how-hsa-can-enhance-your-retirement-nest-egg',
            altText: 'Learn More',
          },
        ],
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('openWebView', () => {
    it('should call journey service openwebview', () => {
      component['isWeb'] = false;
      component.openWebView('https://fpcconsultants.timetap.com/#/');
      expect(journeyServiceSpy.openWebView).toHaveBeenCalledWith(
        'https://fpcconsultants.timetap.com/#/',
        ''
      );
    });
  });
});
