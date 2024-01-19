import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {FeedbackPage} from './feedback.page';
import {ActionOptions} from '@shared-lib/models/ActionOptions.model';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderTypeService} from '@shared-lib/services/header-type/header-type.service';

describe('FeedbackPage', () => {
  let component: FeedbackPage;
  let fixture: ComponentFixture<FeedbackPage>;
  let headerTypeServiceSpy;
  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      TestBed.configureTestingModule({
        declarations: [FeedbackPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FeedbackPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it(' should publish header', () => {
      const actionOption: ActionOptions = {
        headername: 'Feedback',
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
});
