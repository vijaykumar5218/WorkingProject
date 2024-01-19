import {TestBed} from '@angular/core/testing';
import {ValidationType} from '../../../../../../../services/journey/constants/validationType.enum';
import {ValidationRules} from '../../../../../../../services/journey/models/journey.model';
import {InputService} from './input.service';

describe('InputService', () => {
  let service: InputService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [],
    });
    service = TestBed.inject(InputService);
  });

  describe('getValidationRules$', () => {
    it('should return the validationRulesSubject', () => {
      const subject = jasmine.createSpyObj('ValidationRulesSubject', ['']);
      service['validationRulesSubject'] = subject;
      const result = service.getValidationRules$();
      expect(result).toEqual(subject);
    });
  });

  describe('publishValidationRules', () => {
    it('should call next on the subject', () => {
      const subject = jasmine.createSpyObj('ValidationRulesSubject', ['next']);
      service['validationRulesSubject'] = subject;
      const validationRules: ValidationRules = {type: ValidationType.dollar};
      service.publishValidationRules(validationRules);
      expect(subject.next).toHaveBeenCalledWith(validationRules);
    });
  });
});
