import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'journeys-overview-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements AfterViewInit {
  @ViewChild('check', {read: ElementRef, static: true}) checkbox: ElementRef;
  @Input() element: StepContentElement;
  @Input() answer: string;
  @Output() valueChange = new EventEmitter<string>();
  options: AnimationOptions = {};
  checked = false;

  constructor(private journeyService: JourneyService) {}

  ngAfterViewInit() {
    const parsedAnswer = this.journeyService.safeParse(this.answer) as Record<
      string,
      boolean
    >;
    this.checkbox.nativeElement.checked = parsedAnswer?.checked;
  }

  handleClick(checked: boolean) {
    this.checked = !checked;
    if (this.checked) {
      this.options = {
        autoplay: true,
        path: 'assets/animations/CheckAnimation.json',
        loop: false,
      };
    }
    this.valueChange.emit(JSON.stringify({checked: this.checked}));
  }
}
