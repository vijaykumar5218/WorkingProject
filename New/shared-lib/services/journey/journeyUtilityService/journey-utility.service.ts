import {CurrencyPipe} from '@angular/common';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Status} from '@shared-lib/constants/status.enum';
import {MXAccount} from '@shared-lib/services/mx-service/models/mx.model';
import {JourneyService} from '../journey.service';
import {
  Option,
  StepContentElement,
  RadioButtonObject,
  JourneyResponse,
} from '../models/journey.model';
@Injectable({
  providedIn: 'root',
})
export class JourneyUtilityService {
  elements: StepContentElement[];
  constructor(
    private journeyService: JourneyService,
    private currencyPipe: CurrencyPipe,
    private router: Router
  ) {}

  processInnerHTMLData(
    str: string,
    elements: StepContentElement[],
    journeyId: number
  ): string {
    let result = str;
    elements.forEach((ele, i) => {
      let answer = this.journeyService.journeyServiceMap[journeyId][
        ele.answerId
      ];
      if (answer !== undefined && str) {
        if (ele.type === 'dollar') {
          answer = this.currencyPipe.transform(answer, 'USD', true, '1.0-0');
        }
        if (ele.bold) {
          answer = '<strong>' + answer + '</strong>';
        }
        if (ele.textColor) {
          answer = `<span style="color:${ele.textColor}">${answer}</span>`;
        }
        result = result.replace('{' + i + '}', answer);
      }
    });
    return result;
  }

  updateRadioStateValue(
    answer: Record<string, string>,
    radioButtonFilled: boolean,
    element: StepContentElement,
    requiredCompleted: boolean,
    elements: StepContentElement[]
  ): string {
    let stringifiedAnswer = JSON.stringify(answer);
    if (stringifiedAnswer === '{}') {
      stringifiedAnswer = '';
    }
    if (
      (requiredCompleted || !elements) &&
      (radioButtonFilled || !element.isRequired)
    ) {
      return stringifiedAnswer;
    } else {
      return undefined;
    }
  }
  radioButtonClick(
    element: StepContentElement,
    isToggle: boolean,
    option: Option,
    idSuffix: string
  ): RadioButtonObject {
    let answer;
    this.elements = [];
    let isRequiredValidObj: RadioButtonObject;
    element.options.forEach(ele => {
      if (ele === option) {
        option.checked = this.setCheckedValue(isToggle, option);
        if (option.checked) {
          answer = option.id;
          isRequiredValidObj = this.setElements(
            option.elements,
            isToggle,
            idSuffix
          );
        } else if (isToggle && !option.checked) {
          this.elements = [];
        }
      } else {
        ele.checked = false;
      }
    });

    return {
      value: answer,
      isRequiredValid:
        isRequiredValidObj === undefined
          ? false
          : isRequiredValidObj.isRequiredValid,
      elements:
        isRequiredValidObj === undefined ? [] : isRequiredValidObj.elements,
      element: element,
    };
  }
  setCheckedValue(isToggle: boolean, option: Option): boolean {
    return isToggle ? !option.checked : true;
  }
  setElements(
    elements: StepContentElement[],
    isToggle: boolean,
    idSuffix: string
  ): RadioButtonObject {
    let valid = false;
    elements?.forEach((el, i) => {
      el.idSuffix = idSuffix + i;
      if (this.checkValidation(el) && !isToggle) {
        valid = true;
      }
    });
    this.elements = elements;
    return {
      isRequiredValid: valid,
      elements: elements,
      value: '',
    };
  }
  private checkValidation(element: StepContentElement) {
    return element.isRequired ? true : false;
  }

  addAccountIconName(
    accounts: MXAccount[],
    linkedId: string | string[]
  ): MXAccount {
    let selectedAccount;
    accounts?.forEach(acct => {
      if (acct.guid === linkedId) {
        selectedAccount = acct;
        acct.radioButtonIconName = 'radio-button-on';
      } else {
        acct.radioButtonIconName = 'radio-button-off';
      }
    });

    return selectedAccount;
  }

  routeToFirstJourney(journeysResponse: JourneyResponse) {
    if (
      journeysResponse?.recommended &&
      journeysResponse.recommended.length > 0
    ) {
      this.journeyTypeRouterNavigation(journeysResponse, 'recommended');
    } else {
      if (journeysResponse?.all && journeysResponse.all.length > 0) {
        this.journeyTypeRouterNavigation(journeysResponse, 'all');
      }
    }
  }

  private journeyTypeRouterNavigation(
    journeysResponse: JourneyResponse,
    type: string
  ) {
    const journeyID = journeysResponse[type][0].journeyID;
    const journeyStatus = this.journeyService.getJourneyStatus(
      journeysResponse[type][0].steps
    );
    if (journeyStatus === Status.inProgress) {
      this.router.navigate(['/journeys/journey/' + journeyID + '/steps'], {
        queryParams: {journeyType: type},
      });
    } else {
      this.router.navigate(['/journeys/journey/' + journeyID + '/overview'], {
        queryParams: {journeyType: type, fromJourneys: true},
      });
    }
  }
}
