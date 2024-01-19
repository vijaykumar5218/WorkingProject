import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {IonInput, ModalController} from '@ionic/angular';
import {ValidationType} from '@shared-lib/services/journey/constants/validationType.enum';
import {
  StepContentElement,
  ValidationRuleInfo,
  ValidationRules,
} from '@shared-lib/services/journey/models/journey.model';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {InputService} from '../service/input.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'journeys-steps-step-input-text-field',
  templateUrl: './textField.component.html',
  styleUrls: ['./textField.component.scss'],
})
export class TextFieldComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() value: string;
  @Input() placeholder: string;
  @Input() padding: string;
  @Input() input: StepContentElement;
  @Input() idSuffix?: string;
  @Input() ariaLabel: string;
  @Output() valueChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<string>();
  @ViewChild('inputEl') inputEl: IonInput;
  readonly validationType = ValidationType;
  private subscription = new Subscription();

  constructor(
    private journeyService: JourneyService,
    private inputService: InputService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.inputService
        .getValidationRules$()
        .subscribe((validationRules: ValidationRules) => {
          this.input.validationRules = validationRules;
        })
    );
    const service = this.journeyService.journeyServiceMap[
      this.journeyService.getCurrentJourney().journeyID
    ];
    if (service && service.getValidationRules$) {
      this.subscription.add(
        service
          .getValidationRules$()
          .subscribe((validationRuleInfo: ValidationRuleInfo) => {
            if (this.input.answerId === validationRuleInfo.answerId) {
              this.input.validationRules = validationRuleInfo.validationRules;
              this.value = validationRuleInfo.collegeStartAge;
            }
          })
      );
    }
  }

  ngAfterViewInit() {
    if (this.value) {
      this.emitValueChange();
    }
  }

  emitValueChange() {
    this.valueChange.emit(this.value);
  }

  async emitBlur() {
    if (
      this.input.validationRules?.emptyAllowed === false &&
      this.journeyService.isValueEmpty(this.value)
    ) {
      this.value = this.journeyService.addDollar(
        this.input.validationRules.min.toString(),
        this.input
      );
      if (this.input?.displayErrorPopup) {
        this.journeyService.openModal(
          {element: {...this.input, id: 'error-msg'}},
          false
        );
      }
    }
    this.emitValueChange();
    this.blur.emit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
