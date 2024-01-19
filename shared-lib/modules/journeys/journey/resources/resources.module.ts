import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ResourcesRoutingModule} from './resources-routing.module';
import {ResourcesComponent} from './resources.component';
import {ResourceListComponent} from './resource-list/resource-list.component';
import {ExpandCollapseComponentModule} from '../../components/expandCollapse/expand-collapse.module';
import {ModalComponentModule} from '../../components/modal/modal.module';

@NgModule({
  declarations: [ResourcesComponent, ResourcesComponent, ResourceListComponent],
  imports: [
    IonicModule,
    CommonModule,
    ResourcesRoutingModule,
    ExpandCollapseComponentModule,
    ModalComponentModule,
  ],
})
export class ResourcesModule {}
