import {Component, Input} from '@angular/core';
import {
  Resource,
  ResourceLink,
} from '@shared-lib/services/journey/models/resourcesContent.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';

@Component({
  selector: 'journeys-resources-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss'],
})
export class ResourceListComponent {
  @Input() resource: Resource;
  @Input() idSuffix: string;

  constructor(private journeyService: JourneyService) {}

  openLink(link: ResourceLink) {
    if (this.resource.type === 'webview') {
      this.journeyService.openWebView(link.link);
    } else if (this.resource.type === 'video') {
      this.journeyService.openModal({element: link});
    }
  }
}
