import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {InputComponent} from './input.component';
import {TextFieldComponent} from './textField/textField.component';
import {TableComponent} from './table/table.component';
import {WordComponent} from './word/word.component';
import {RadioButtonComponent} from './radio-button/radio-button.component';
import {SelectComponent} from './select/select.component';
import {RadioButtonStepComponent} from './radio-button/radio-button-step/radio-button-step.component';
import {SliderComponent} from './slider/slider.component';
import {AccountRadioButtonComponent} from './account-radio-button/account-radio-button.component';
import {IconTextButtonSelectComponent} from './icon-text-button-select/icon-text-button-select.component';
import {FormsModule} from '@angular/forms';
import {IconTextButtonComponent} from '@shared-lib/modules/journeys/components/icon-text-button/icon-text-button.component';
import {ValidationDirective} from '../../../../directives/validation/validation.directive';
import {HelpComponent} from '../help/help.component';
import {HelpComponentModule} from '../help/help.component.module';
import {IntroComponentModule} from '../intro/intro.module';
import {StepTableComponentModule} from '@shared-lib/components/table/table.component.module';
import {RadioComponent} from './radio-button/radio/radio.component';
import {CircleRadioButtonComponent} from './radio-button/circle-radio-button/circle-radio-button.component';
import {ContentLinkModalComponentModule} from '../contentLink/contentLinkModal.module';
import {CalendarComponent} from './calendar/calendar.component';
import {TypeaheadComponent} from './typeahead/typeahead.component';
import {SearchbarComponent} from './searchbar/searchbar.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HelpComponentModule,
    IntroComponentModule,
    StepTableComponentModule,
    ContentLinkModalComponentModule,
  ],
  declarations: [
    InputComponent,
    TextFieldComponent,
    TableComponent,
    WordComponent,
    RadioButtonComponent,
    SelectComponent,
    RadioButtonStepComponent,
    SliderComponent,
    AccountRadioButtonComponent,
    IconTextButtonSelectComponent,
    ValidationDirective,
    CircleRadioButtonComponent,
    RadioComponent,
    CalendarComponent,
    TypeaheadComponent,
    SearchbarComponent,
  ],
  exports: [InputComponent, IconTextButtonComponent, HelpComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InputComponentModule {}
