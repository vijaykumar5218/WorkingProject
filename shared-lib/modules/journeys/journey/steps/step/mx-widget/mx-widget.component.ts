import {Component, Input} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

@Component({
  selector: 'journeys-steps-step-mx-widget',
  templateUrl: './mx-widget.component.html',
  styleUrls: ['./mx-widget.component.scss'],
})
export class MxWidgetComponent {
  randomStr: string;
  @Input() element: StepContentElement;

  constructor(
    private router: Router,
    private utilityService: SharedUtilityService
  ) {}

  viewMoreClicked() {
    if (this.utilityService.getIsWeb()) {
      this.router.navigateByUrl(this.element.weblink);
    } else {
      this.router.navigateByUrl(this.element.link);
    }
  }

  ngOnInit() {
    this.randomStr = Date.now().toString();
  }
}
