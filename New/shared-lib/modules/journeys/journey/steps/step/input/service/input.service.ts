import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {ValidationRules} from '@shared-lib/services/journey/models/journey.model';

@Injectable({
  providedIn: 'root',
})
export class InputService {
  private validationRulesSubject = new ReplaySubject<ValidationRules>(1);

  getValidationRules$(): Observable<ValidationRules> {
    return this.validationRulesSubject;
  }

  publishValidationRules(validationRules: ValidationRules) {
    this.validationRulesSubject.next(validationRules);
  }
}
