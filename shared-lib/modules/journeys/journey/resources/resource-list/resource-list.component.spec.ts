import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {ResourceListComponent} from './resource-list.component';
describe('ResourceListComponent', () => {
  let component: ResourceListComponent;
  let fixture: ComponentFixture<ResourceListComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'openWebView',
        'openModal',
      ]);
      TestBed.configureTestingModule({
        declarations: [ResourceListComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(ResourceListComponent);
      component = fixture.componentInstance;
      component.resource = {
        header: 'resource',
        isExpanded: false,
        type: 'webview',
        links: [],
      };
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openLink', () => {
    it('should call journeyService openWebview if it is a webview', () => {
      component.resource.type = 'webview';
      component.openLink({
        text: 'ssa.gov',
        link: 'https://www.ssa.gov',
      });
      expect(journeyServiceSpy.openWebView).toHaveBeenCalledWith(
        'https://www.ssa.gov'
      );
    });

    it('should call journeyservice openModal if it is a video', () => {
      const videoUrl =
        'https://cdnapisec.kaltura.com/p/1234081/sp/123408100/embedIframeJs/uiconf_id/48794683/partner_id/1234081?iframeembed=true&playerId=';
      const playerId = 'kaltura_player_1642011223';
      component.resource.type = 'video';
      const link = {
        text: 'ssa.gov',
        videoUrl: videoUrl,
        playerId: playerId,
      };
      component.openLink(link);

      expect(journeyServiceSpy.openModal).toHaveBeenCalledWith({element: link});
    });

    it('should not call journeyservice openwebview or openModal if its not a webview or video', () => {
      component.resource.type = undefined;
      component.openLink({text: 'abc'});
      expect(journeyServiceSpy.openWebView).not.toHaveBeenCalled();
      expect(journeyServiceSpy.openModal).not.toHaveBeenCalled();
    });
  });
});
