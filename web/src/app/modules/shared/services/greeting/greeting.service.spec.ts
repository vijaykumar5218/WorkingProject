import {TestBed, waitForAsync} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {GreetingService} from './greeting.service';

describe('GreetingService', () => {
  let service: GreetingService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [GreetingService],
      });
      service = TestBed.inject(GreetingService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize', () => {
    beforeEach(() => {
      service.pageText.morningTimeCondition = '12';
      service.pageText.eveningTimeCondition = '16';
      spyOn(service, 'manageTimingFlag');
    });

    it('when localTime will be less then morningTimeCondition', () => {
      spyOn(service, 'getLocaltime').and.returnValue('11');
      service.initialize();
      expect(service.getLocaltime).toHaveBeenCalled();
      expect(service.manageTimingFlag).toHaveBeenCalledWith(true, false);
    });
    it('when localTime will be more then eveningTimeCondition', () => {
      spyOn(service, 'getLocaltime').and.returnValue('18');
      service.initialize();
      expect(service.getLocaltime).toHaveBeenCalled();
      expect(service.manageTimingFlag).toHaveBeenCalledWith(false, true);
    });
    it('when localTime will be inbetween morningTimeCondition and eveningTimeCondition', () => {
      spyOn(service, 'getLocaltime').and.returnValue('14');
      service.initialize();
      expect(service.getLocaltime).toHaveBeenCalled();
      expect(service.manageTimingFlag).toHaveBeenCalledWith(false, false);
    });
  });

  describe('getIsMorningFlag', () => {
    it('get call for getIsMorningFlag is true', () => {
      service.isMorning = true;
      const result = service.getIsMorningFlag();
      expect(result).toEqual(service.isMorning);
    });
    it('get call for getIsMorningFlag is false', () => {
      service.isMorning = false;
      const result = service.getIsMorningFlag();
      expect(result).toEqual(service.isMorning);
    });
  });

  describe('getIsEveningFlag', () => {
    it('get call for getIsEveningFlag is true', () => {
      service.isEvening = true;
      const result = service.getIsEveningFlag();
      expect(result).toEqual(service.isEvening);
    });
    it('get call for getIsEveningFlag is false', () => {
      service.isEvening = false;
      const result = service.getIsEveningFlag();
      expect(result).toEqual(service.isEvening);
    });
  });
});
