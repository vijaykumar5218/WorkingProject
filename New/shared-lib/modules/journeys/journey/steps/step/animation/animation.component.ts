import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'journeys-steps-step-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss'],
})
export class AnimationComponent implements OnInit {
  @Input() element: StepContentElement;
  @Input() index: number;
  @ViewChild('img') img: ElementRef;
  widthOfSpriteSheet: number;
  times = 0;
  animationInterval: NodeJS.Timeout;
  animationSeen = false;
  currentStepSubscription: Subscription;
  speed: number;

  constructor(private journeyService: JourneyService) {}

  ngOnInit() {
    this.speed = this.element.speed ? this.element.speed : 50;
    this.widthOfSpriteSheet =
      this.element.widthOfEachSprite * (this.element.numberOfSpritesPerRow - 1);
    this.currentStepSubscription = this.journeyService
      .getCurrentStep$()
      .subscribe((currentStep: number) => {
        if (currentStep === this.index) {
          this.startAnimation();
        }
      });
  }

  startAnimation() {
    if (!this.animationSeen) {
      this.animationSeen = true;
      let positionX = this.element.widthOfEachSprite;
      let positionY = 0;

      this.animationInterval = setInterval(() => {
        this.times++;
        this.img.nativeElement.style.backgroundPosition = `-${positionX}px -${positionY}px`;
        if (positionX < this.widthOfSpriteSheet) {
          positionX = positionX + this.element.widthOfEachSprite;
        } else {
          positionX = 0;
          positionY = positionY + this.element.heightOfEachSprite;
        }
        if (this.times >= this.element.totalNumberOfSprites - 1) {
          clearInterval(this.animationInterval);
          this.times = 0;
        }
      }, this.speed);
    }
  }

  ngOnDestroy() {
    this.currentStepSubscription.unsubscribe();
  }
}
