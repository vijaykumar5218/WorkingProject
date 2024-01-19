import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Option} from '@shared-lib/services/journey/models/journey.model';

@Component({
  selector: 'journeys-steps-step-input-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss'],
})
export class WordComponent {
  @Input() options: Option[];
  @Input() idSuffix: string;
  @Output() selectionChange = new EventEmitter<string>();
  private value: Option[] = [];
  @Input() defaultValue: string;

  ngOnInit() {
    if (this.defaultValue) {
      this.value = JSON.parse(this.defaultValue);
    }
  }

  toggleSelectOption(option: Option) {
    if (this.getSelected(option)) {
      this.value = this.value.filter(opt => option.id != opt.id);
    } else {
      this.value.push(option);
    }
    this.selectionChange.emit(JSON.stringify(this.value));
  }

  getSelected(option: Option): boolean {
    return this.value.filter(opt => option.id === opt.id).length > 0;
  }
}
