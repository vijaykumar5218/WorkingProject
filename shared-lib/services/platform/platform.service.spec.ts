import {TestBed, waitForAsync} from '@angular/core/testing';
import {PlatformService} from './platform.service';
import {Platform} from '@ionic/angular';
import {of} from 'rxjs';
import {Router} from '@angular/router';

describe('PlatformService', () => {
  let service: PlatformService;
  let platformSpy: any;
  let router;

  beforeEach(
    waitForAsync(() => {
      platformSpy = jasmine.createSpyObj('platformSpy', ['is', 'width'], {
        resize: of(jasmine.createSpyObj('resize', ['subscribe'])),
      });
      router = {
        navigateByUrl: jasmine.createSpy('navigate'),
      };

      TestBed.configureTestingModule({
        imports: [],
        providers: [
          PlatformService,
          {provide: Router, useValue: router},
          {provide: Platform, useValue: platformSpy},
        ],
      });
      service = TestBed.inject(PlatformService);
    })
  );

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('When _currentPlatform will be native', () => {
    service._currentPlatform = 'native';
    expect(service.isNative()).toBeTruthy();
    expect(service.isBrowser()).toBeFalsy();
  });

  it('When _currentPlatform will be browser', () => {
    service._currentPlatform = 'browser';
    expect(service.isNative()).toBeFalsy();
    expect(service.isBrowser()).toBeTruthy();
  });

  describe('setCurrentPlatform()', () => {
    describe('When platform is ios', () => {
      it('When _currentPlatform would be mobile', () => {
        platformSpy.is
          .withArgs('ios')
          .and.returnValue(true)
          .withArgs('android')
          .and.returnValue(false)
          .withArgs('desktop')
          .and.returnValue(false)
          .withArgs('mobileweb')
          .and.returnValue(false);
        service.setCurrentPlatform();
        expect(service._currentPlatform).toEqual('native');
      });
    });
    describe('When platform is android', () => {
      it('When _currentPlatform would be mobile', () => {
        platformSpy.is
          .withArgs('ios')
          .and.returnValue(false)
          .withArgs('android')
          .and.returnValue(true)
          .withArgs('desktop')
          .and.returnValue(false)
          .withArgs('mobileweb')
          .and.returnValue(false);
        service.setCurrentPlatform();
        expect(service._currentPlatform).toEqual('native');
      });
    });
    describe('When platform is desktop', () => {
      it('When _currentPlatform would be browser', () => {
        platformSpy.is
          .withArgs('ios')
          .and.returnValue(false)
          .withArgs('android')
          .and.returnValue(false)
          .withArgs('desktop')
          .and.returnValue(true)
          .withArgs('mobileweb')
          .and.returnValue(false);
        service.setCurrentPlatform();
        expect(service._currentPlatform).toEqual('browser');
      });
    });
    describe('When platform is mobileweb', () => {
      it('When _currentPlatform would be browser', () => {
        platformSpy.is
          .withArgs('ios')
          .and.returnValue(false)
          .withArgs('android')
          .and.returnValue(false)
          .withArgs('desktop')
          .and.returnValue(false)
          .withArgs('mobileweb')
          .and.returnValue(true);
        service.setCurrentPlatform();
        expect(service._currentPlatform).toEqual('browser');
      });
    });
  });

  describe('currentPlatform', () => {
    it('return get currentPlatform', () => {
      platformSpy.is
        .withArgs('ios')
        .and.returnValue(true)
        .withArgs('android')
        .and.returnValue(false)
        .withArgs('desktop')
        .and.returnValue(false)
        .withArgs('mobileweb')
        .and.returnValue(false);
      service.setCurrentPlatform();
      expect(service.currentPlatform).toEqual('native');
    });
  });

  describe('platformWidth', () => {
    it('when _deviceWidth would be 920', done => {
      service._deviceWidth = 0;
      platformSpy.width.and.returnValue(920);
      service.platformWidth();
      expect(service._deviceWidth).toEqual(920);
      service.isDesktop().subscribe(data => {
        expect(data).toEqual(false);
        done();
      });
    });
    it('when _deviceWidth would be 921', done => {
      service._deviceWidth = 0;
      platformSpy.width.and.returnValue(921);
      service.platformWidth();
      expect(service._deviceWidth).toEqual(921);
      service.isDesktop().subscribe(data => {
        expect(data).toEqual(true);
        done();
      });
    });
  });

  describe('navigateByUrl', () => {
    it('should route to given Url', () => {
      const path = '/account/retirement-account';
      service.navigateByUrl(path);
      expect(router.navigateByUrl).toHaveBeenCalledWith(path);
    });
  });

  describe('isDesktop', () => {
    it('When it returns true', done => {
      service['isDesktopSubject'].next(true);
      service.isDesktop().subscribe(data => {
        expect(data).toEqual(true);
        done();
      });
    });
    it('When it returns false', done => {
      service['isDesktopSubject'].next(false);
      service.isDesktop().subscribe(data => {
        expect(data).toEqual(false);
        done();
      });
    });
  });
});
