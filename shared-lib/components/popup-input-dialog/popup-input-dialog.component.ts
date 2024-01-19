import {CurrencyPipe} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import * as pageText from './constants/popup-input-text.json';
import {PopupInputType} from './constants/popup-input-type.enum';

interface InputValidator {
  (input?: number | string): string;
}
interface SaveFunction {
  (value: number | string): Promise<any>;
}

@Component({
  selector: 'app-popup-input-dialog',
  templateUrl: './popup-input-dialog.component.html',
  styleUrls: ['./popup-input-dialog.component.scss'],
})
export class PopupInputDialogComponent implements OnInit {
  @Input() public title: string;
  @Input() public inputTitle: string;
  @Input() public value: number | string;
  @Input() public inputType: PopupInputType;
  allInputTypes = PopupInputType;
  public validator: InputValidator;
  public saveFunction: SaveFunction;
  saving = false;
  invalid = false;
  errorText: string;

  pageText = JSON.parse(JSON.stringify(pageText)).default;

  constructor(
    public modalController: ModalController,
    private currencyPipe: CurrencyPipe,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit() {
    if (this.inputType == PopupInputType.currency) {
      const tempVal = this.currencyPipe.transform(
        this.value,
        'USD',
        true,
        '1.2-2'
      );
      this.value = tempVal.substring(1, tempVal.length);
    }
  }

  beforeInput(event: InputEvent): boolean {
    const pattern = /[0-9]/;
    if (event.data !== null && !pattern.test(event.data)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  valueChanged(val: string | number, inputType?: string) {
    this.value = val?.toString();
    if (inputType === this.allInputTypes.phone) {
      this.value = this.utilityService.formatPhone(val);
    }
    this.invalid = false;
    if (this.validator) {
      this.errorText = this.validator(this.getCleanedValue(val));
      if (this.errorText) {
        this.invalid = true;
      }
    }
  }

  closeDialog(saved = false) {
    this.modalController.dismiss({
      saved: saved,
    });
  }

  getCleanedValue(val: any) {
    if (typeof val === 'string' || val instanceof String) {
      return val.replace(/,/g, '');
    }
    return val;
  }

  async closeDialogClicked(save: boolean) {
    if (save) {
      //Validate  again. To make sure an unaltered value should be saved.
      if (this.validator) {
        this.errorText = this.validator(this.getCleanedValue(this.value));
        if (this.errorText) {
          this.invalid = true;
          return;
        }
      }

      this.saving = true;
      if (this.saveFunction) {
        const result = await this.saveFunction(
          this.getCleanedValue(this.value)
        );
        if (result) {
          this.closeDialog(true);
        } else {
          this.errorText = this.pageText.failedToSave;
          this.saving = false;
        }
      } else {
        this.closeDialog();
      }
    } else {
      this.closeDialog();
    }
  }
}
