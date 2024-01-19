import {Component} from '@angular/core';
import {
  Resource,
  ResourcesContent,
} from '@shared-lib/services/journey/models/resourcesContent.model';
import * as journeyContent from '@shared-lib/services/journey/constants/journey-content.json';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {ViewWillEnter} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
@Component({
  selector: 'journeys-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements ViewWillEnter {
  resources: ResourcesContent;
  content: JourneyContent = journeyContent;
  expandAll = true;
  isWeb: boolean;

  constructor(
    private footerService: FooterTypeService,
    private journeyService: JourneyService,
    private sharedUtilityService: SharedUtilityService
  ) {}

  ngOnInit() {
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  ionViewWillEnter() {
    if (!this.isWeb) {
      this.footerService.publish({
        type: FooterType.tabsnav,
        selectedTab: 'journeys',
      });
    } else {
      this.footerService.publish({
        type: FooterType.tabsnav,
        selectedTab: 'journeys-list',
      });
    }
    this.journeyService.publishSelectedTab('resources');
    this.resources = this.journeyService.getCurrentJourney().parsedResourcesContent;
  }

  toggleExpand(resourceType: Resource) {
    resourceType.isExpanded = !resourceType.isExpanded;
    this.expandAll = this.resources.resources.some(
      resource => !resource.isExpanded
    );
  }

  expandCollapseAll() {
    this.resources.resources.forEach(resource => {
      resource.isExpanded = this.expandAll;
    });
    this.expandAll = !this.expandAll;
  }
}
