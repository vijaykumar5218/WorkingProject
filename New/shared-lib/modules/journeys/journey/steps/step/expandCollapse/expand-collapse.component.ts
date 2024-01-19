import {Component, Input, OnInit} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-steps-step-expand-collapse',
  templateUrl: './expand-collapse.component.html',
  styleUrls: ['./expand-collapse.component.scss'],
})
export class ExpandCollapseComponent implements OnInit {
  @Input() element: StepContentElement;
  stepContentElements: StepContentElement[] = [];

  ngOnInit() {
    this.element.options?.forEach((option, i) => {
      this.stepContentElements.push({
        description: option.description,
        descriptions: option.descriptions,
        webviewHeader: option.webviewHeader,
        webviewLinks: option.webviewLinks,
        webviewHeaders: option.webviewHeaders,
        webviewToolbars: option.webviewToolbars,
        videoUrl: option.videoUrl,
        videoUrls: option.videoUrls,
        idSuffix: this.element.idSuffix + i,
      });
    });
  }
}
