import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PreferenceSelectionPage} from './preferences-selection.page';
import {CardModalModule} from './../../components/coverages/plan-tabs/plan-details/my-id-card/card-modal/card-modal.module';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CardModalModule],
  declarations: [PreferenceSelectionPage],
})
export class PreferenceSelectionModule {}
