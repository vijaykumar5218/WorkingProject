import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FilteredRecords,
  FilterOption,
  StepContentElement,
} from '@shared-lib/services/journey/models/journey.model';
import {ModalController} from '@ionic/angular';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'journeys-steps-step-input-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class TypeaheadComponent {
  @Input() element: StepContentElement;
  @Input() searchValue: string;
  @Input() isWeb: boolean;
  filteredItems: FilterOption[] = [];
  currentPage = 1;
  totalPages = 1;
  @Output() itemSelected = new EventEmitter<FilterOption>();
  selectedValue: FilterOption;
  loading = false;
  searchTerms: Subject<string> = new Subject<string>();
  searchTermsSubscription = new Subscription();

  constructor(
    private modalController: ModalController,
    private journeyService: JourneyService
  ) {
    this.searchTermsSubscription = this.searchTerms
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term: string) => {
        this.searchValue = term;
        this.filterList(false);
      });
  }

  ngOnInit() {
    this.loading = true;
    this.searchTerms.next(this.searchValue);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchValue) {
      this.searchTerms.next(this.searchValue);
    }
  }

  async filterList(scroll: boolean) {
    if (!scroll) {
      this.loading = true;
      this.currentPage = 1;
      this.totalPages = 1;
      this.filteredItems = [];
    }
    if (this.currentPage <= this.totalPages) {
      let searchUrl = 'page=' + this.currentPage;
      if (this.searchValue) {
        searchUrl = searchUrl + '&name=' + encodeURIComponent(this.searchValue);
      }
      const result: FilteredRecords = await this.journeyService.getFilteredList(
        searchUrl
      );
      if (
        (searchUrl.includes('name=') &&
          searchUrl.split('name=')[1] ===
            encodeURIComponent(this.searchValue)) ||
        (!searchUrl.includes('name=') && !this.searchValue)
      ) {
        this.totalPages = result.totalPages;
        this.filteredItems =
          result.page === 1
            ? result.options
            : [...this.filteredItems, ...result.options];
      }
      this.currentPage += 1;
      this.loading = false;
    }
  }

  onItemSelected() {
    if (this.isWeb) {
      this.itemSelected.emit(this.selectedValue);
    } else {
      this.modalController.dismiss(this.selectedValue);
    }
  }

  closeDialog() {
    this.modalController.dismiss();
  }

  onIonInfinite(event: Record<string, any>) {
    this.filterList(true);
    event.target.complete();
  }

  ngOnDestroy(): void {
    this.searchTermsSubscription.unsubscribe();
  }
}
