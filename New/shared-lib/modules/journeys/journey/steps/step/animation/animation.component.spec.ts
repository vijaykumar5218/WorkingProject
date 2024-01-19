import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {of} from 'rxjs';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {AnimationComponent} from './animation.component';

describe('AnimationComponent', () => {
  let component: AnimationComponent;
  let fixture: ComponentFixture<AnimationComponent>;
  let startAnimationSpy;
  let journeyServiceSpy;

  beforeEach(
    waitForAsync(() => {
      journeyServiceSpy = jasmine.createSpyObj('JourneyService', [
        'getCurrentStep$',
      ]);
      journeyServiceSpy.getCurrentStep$.and.returnValue(of(5));
      TestBed.configureTestingModule({
        declarations: [AnimationComponent],
        imports: [IonicModule.forRoot()],
        providers: [{provide: JourneyService, useValue: journeyServiceSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(AnimationComponent);
      component = fixture.componentInstance;
      component.element = {
        id: 'animation',
        imageUrl:
          'assets/icon/journeys/retirement/Retirement-Journey-Pause-Screen-1-Sprite-Sheet.png',
        numberOfSpritesPerRow: 2,
        numberOfSpritesPerColumn: 3,
        totalNumberOfSprites: 5,
        widthOfEachSprite: 288,
        heightOfEachSprite: 248,
      };
      startAnimationSpy = spyOn(component, 'startAnimation');
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should default the speed to 50 if none passed in', () => {
      component.element.speed = undefined;
      component.speed = undefined;
      component.ngOnInit();
      expect(component.speed).toEqual(50);
    });

    it('should set the speed according to element if it is passed in', () => {
      component.element.speed = 65;
      component.speed = undefined;
      component.ngOnInit();
      expect(component.speed).toEqual(65);
    });

    it('should set widthOfSpriteSheet', () => {
      expect(component.widthOfSpriteSheet).toEqual(288);
    });

    it('should subscribe to the currentStep and start the animation if slide is in view', () => {
      component.index = 5;
      component.ngOnInit();
      expect(journeyServiceSpy.getCurrentStep$).toHaveBeenCalled();
      expect(startAnimationSpy).toHaveBeenCalled();
    });

    it('should not start the animation if slide is not in view', () => {
      component.index = 4;
      component.ngOnInit();
      expect(startAnimationSpy).not.toHaveBeenCalled();
    });
  });

  describe('startAnimation', () => {
    beforeEach(() => {
      startAnimationSpy.and.callThrough();
    });

    it('should not run the animation if it has already been seen', fakeAsync(() => {
      component.speed = 50;
      component.animationSeen = true;
      component.img.nativeElement.style.backgroundPosition = '0px 0px';
      component.startAnimation();
      tick(50);
      expect(component.img.nativeElement.style.backgroundPosition).toEqual(
        '0px 0px'
      );
    }));

    it('should run the animation if it has not already been seen', fakeAsync(() => {
      component.speed = 50;
      component.animationSeen = false;
      expect(component.img.nativeElement.style.backgroundPosition).toEqual(
        '0px 0px'
      );
      component.startAnimation();
      tick(50);
      expect(component.img.nativeElement.style.backgroundPosition).toEqual(
        '-288px 0px'
      );
      tick(50);
      expect(component.img.nativeElement.style.backgroundPosition).toEqual(
        '0px -248px'
      );
      tick(50);
      expect(component.img.nativeElement.style.backgroundPosition).toEqual(
        '-288px -248px'
      );
      tick(50);
      expect(component.img.nativeElement.style.backgroundPosition).toEqual(
        '0px -496px'
      );
      expect(component.animationSeen).toBeTrue();
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from currentStepSubscription', () => {
      spyOn(component.currentStepSubscription, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.currentStepSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
