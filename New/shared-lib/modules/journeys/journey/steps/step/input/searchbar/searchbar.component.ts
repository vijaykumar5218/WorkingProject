import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  FilterOption,
  StepContentElement,
} from '@shared-lib/services/journey/models/journey.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {TypeaheadComponent} from '../typeahead/typeahead.component';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'journeys-steps-step-input-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent {
  @Input() element: StepContentElement;
  @Input() defaultValue: string;
  @Output() valueChange = new EventEmitter<string>();
  isWeb = false;
  searchValue: string;
  showFilteredList: boolean;

  constructor(
    private utilityService: SharedUtilityService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    if (this.defaultValue) {
      this.searchValue = JSON.parse(this.defaultValue).name;
    }
  }

  searchbarInput(value: string) {
    this.searchValue = value;
    this.showFilteredList = true;
  }

  async searchInput() {
    const modal = await this.modalController.create({
      component: TypeaheadComponent,
      cssClass: 'modal-fullscreen',
      componentProps: {
        element: this.element,
        isWeb: this.isWeb,
      },
    });
    modal.onDidDismiss().then((data: Record<string, FilterOption>) => {
      this.getSelectedItem(data['data']);
    });
    modal.present();
  }

  getSelectedItem(item: FilterOption) {
    this.showFilteredList = false;
    this.searchValue = item.name;
    this.valueChange.emit(JSON.stringify(item));
  }

  deleteSelectedItem(value: string) {
    value = value ? value.trim() : value;
    if (!value) {
      this.showFilteredList = false;
      this.valueChange.emit(undefined);
    }
  }
}
