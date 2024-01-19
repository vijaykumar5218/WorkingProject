import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {VideoComponent} from './video.component';

describe('VideoComponent', () => {
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', ['openModal']);
      TestBed.configureTestingModule({
        declarations: [VideoComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(VideoComponent);
      component = fixture.componentInstance;
      component.element = {
        id: 'video',
        videoUrl:
          'https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=',
        playerId: 'kaltura_player_1642011223',
        imageUrl: 'assets/icon/journeys/retirement/Group_972.png',
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openModal', () => {
    it('should call journeyservice openModal', () => {
      component.openModal();
      expect(journeyServiceSpy.openModal).toHaveBeenCalledWith({
        element: {
          id: 'video',
          videoUrl:
            'https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=',
          playerId: 'kaltura_player_1642011223',
          imageUrl: 'assets/icon/journeys/retirement/Group_972.png',
        },
      });
    });
  });
});
