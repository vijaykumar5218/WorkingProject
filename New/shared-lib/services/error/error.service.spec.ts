import {TestBed} from '@angular/core/testing';
import {ErrorService} from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default displayError to false', () => {
    service.displayError.subscribe(b => expect(b).toBe(false));
  });

  it('should update observable with new value when setDisplayError is called', () => {
    const displayError$ = service.getDisplayError();
    service.setDisplayError(true);
    displayError$.subscribe(b => expect(b).toBe(true));
  });

  describe('setDisplayError', () => {
    it('should set displayError to boolean value provided', () => {
      service.setDisplayError(true);
      service.displayError.subscribe(b => expect(b).toBe(true));
    });
  });

  describe('getDisplayError', () => {
    it('should return displayError null', () => {
      service.displayError.next(null);
      service.displayError.subscribe(b => expect(b).toBe(null));
    });
  });
});
