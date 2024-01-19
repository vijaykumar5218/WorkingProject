import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {JourneyService} from '../../../../../../services/journey/journey.service';
import {HelpComponent} from './help.component';

@Component({selector: 'v-icon', template: ''})
class MockVIconComponent {
  @Input() name;
}

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', ['openModal']);
      TestBed.configureTestingModule({
        declarations: [HelpComponent, MockVIconComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(HelpComponent);
      component = fixture.componentInstance;
      component.help = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('openHelpModal', () => {
    it('should call openmodal', async () => {
      const help = {
        text: 'abc',
        description: '123',
      };
      component.help = help;
      await component.openHelpModal();
      expect(journeyServiceSpy.openModal).toHaveBeenCalledWith(
        {
          element: {
            id: 'help',
            text: 'abc',
            description: '123',
          },
        },
        false
      );
    });
  });
});
