import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '../../../../../../services/journey/journey.service';
import {HeaderWithLogoComponent} from './header-with-logo.component';

describe('HeaderWithLogoComponent', () => {
  let component: HeaderWithLogoComponent;
  let fixture: ComponentFixture<HeaderWithLogoComponent>;
  let journeyServiceSpy;
  let serviceSpy;

  beforeEach(
    waitForAsync(() => {
      serviceSpy = jasmine.createSpyObj('service', ['']);
      journeyServiceSpy = jasmine.createSpyObj(
        'JourneyService',
        ['getCurrentJourney'],
        {journeyServiceMap: {7: serviceSpy}}
      );
      journeyServiceSpy.getCurrentJourney.and.returnValue({journeyID: 7});
      TestBed.configureTestingModule({
        declarations: [HeaderWithLogoComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(HeaderWithLogoComponent);
      component = fixture.componentInstance;
      component.element = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.service).toEqual(serviceSpy);
  });
});
