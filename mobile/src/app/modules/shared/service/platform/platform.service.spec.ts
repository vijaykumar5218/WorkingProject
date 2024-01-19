import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Platform} from '@ionic/angular';
import {BackButtonEmitter} from '@ionic/angular/common/providers/platform';

import {PlatformService} from './platform.service';

describe('PlatformService', () => {
  let service: PlatformService;
  let resumeSpy;
  let pauseSpy;
  let platformSpy;

  beforeEach(() => {
    resumeSpy = jasmine.createSpyObj('OBJ', ['subscribe']);
    pauseSpy = jasmine.createSpyObj('OBJ', ['subscribe']);
    platformSpy = jasmine.createSpyObj('Platform', ['ready', 'is'], {
      resume: resumeSpy,
      pause: pauseSpy,
      keyboardDidShow: {object: ''},
      backButton: {} as BackButtonEmitter,
    });
    platformSpy.ready.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      imports: [],
      providers: [{provide: Platform, useValue: platformSpy}],
    });
    service = TestBed.inject(PlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize', () => {
    it('should initialize resume, pause, and ready', () => {
      service.initialize();

      expect(platformSpy.ready).toHaveBeenCalled();
      expect(resumeSpy.subscribe).toHaveBeenCalled();
      expect(pauseSpy.subscribe).toHaveBeenCalled();
    });
  });

  describe('resume', () => {
    let resumeSpy;
    beforeEach(() => {
      resumeSpy = jasmine.createSpyObj('OnResume', ['next']);
      service['onResume'] = resumeSpy;
      service.setInitialResume(async () => {
        return true;
      });
      resumeSpy.next.calls.reset();
    });

    it('should call initialResume function and then call onResume.next if initialFunction returns true', async () => {
      service['pauseBackgroundListeners'] = false;
      const resumeSpy = jasmine.createSpyObj('OnResume', ['next']);
      service['onResume'] = resumeSpy;

      await service.resume();

      expect(resumeSpy.next).toHaveBeenCalled();
    });

    it('should call initialResume function and then not call onResume.next if initialFunction returns false', async () => {
      service.setInitialResume(async () => {
        return false;
      });

      service['pauseBackgroundListeners'] = false;
      const resumeSpy = jasmine.createSpyObj('OnResume', ['next']);
      service['onResume'] = resumeSpy;

      await service.resume();

      expect(resumeSpy.next).not.toHaveBeenCalled();
    });

    it('should not call anything if pauseBackgroundListeners = true', fakeAsync(async () => {
      service['pauseBackgroundListeners'] = true;

      await service.resume();
      tick(200);

      expect(resumeSpy.next).not.toHaveBeenCalled();
    }));
  });

  describe('pause', () => {
    let pauseSpy;
    beforeEach(() => {
      pauseSpy = jasmine.createSpyObj('OnPause', ['next']);
      service['onPause'] = pauseSpy;
    });

    it('should call onPause.next', async () => {
      service['pauseBackgroundListeners'] = false;

      await service.pause();
      expect(pauseSpy.next).toHaveBeenCalled();
    });

    it('should not call onPause.next if paused', async () => {
      service['pauseBackgroundListeners'] = true;

      await service.pause();
      expect(pauseSpy.next).not.toHaveBeenCalled();
    });
  });

  describe('setInitialResume', () => {
    it('should initialResume function', () => {
      const func = async () => {
        return true;
      };
      service.setInitialResume(func);
      expect(service['initialResume']).toEqual(func);
    });
  });

  describe('isIos', () => {
    it('should call platform.is(ios)', () => {
      platformSpy.is.and.returnValue(true);

      const result = service.isIos();

      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(result).toBeTrue();
    });
  });

  describe('keyboardDidShow', () => {
    it('should return platform.keyboardDidShow', () => {
      const result = service.keyboardDidShow();
      expect(result).toEqual({object: ''});
    });
  });

  describe('backButton', () => {
    it('should return platform backButton', () => {
      const result = service.backButton();
      expect(result).toEqual({} as BackButtonEmitter);
    });
  });
});
