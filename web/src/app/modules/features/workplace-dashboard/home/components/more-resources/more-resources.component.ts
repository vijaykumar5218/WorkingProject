import {Component, Input} from '@angular/core';
import {ResourcesLinks} from '../../../../../shared/services/header-type/models/MoreResource.model';

@Component({
  selector: 'app-more-resources',
  templateUrl: './more-resources.component.html',
  styleUrls: ['./more-resources.component.scss'],
})
export class MoreResourcesComponent {
  @Input() moreResources: ResourcesLinks;

  openLink(linkPath: string) {
    window.open(linkPath, '_self');
  }
}
