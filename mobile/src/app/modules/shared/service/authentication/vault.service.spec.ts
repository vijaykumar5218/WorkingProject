import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {Device, VaultError} from '@ionic-enterprise/identity-vault';
import {VaultService} from './vault.service';
import {
  biometricsVaultConfig,
  defaultVaultConfig,
} from './contants/authConstants';

describe('VaultService', () => {
  let service: VaultService;
  let vaultSpy;
  let initSpy;
  let routerSpy;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    initSpy = spyOn(VaultService.prototype, 'initializeVault');

    TestBed.configureTestingModule({
      imports: [],
      providers: [VaultService, {provide: Router, useValue: routerSpy}],
    }).compileComponents();
    service = TestBed.inject(VaultService);

    service.vault = vaultSpy = jasmine.createSpyObj(
      'Vault',
      [
        'lock',
        'unlock',
        'isLocked',
        'doesVaultExist',
        'clear',
        'updateConfig',
        'onError',
      ],
      {config: defaultVaultConfig}
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeVault', () => {
    beforeEach(() => {
      initSpy.and.callThrough();
    });

    it('should set up vault', () => {
      service.initializeVault();
      expect(service.vault).toBeDefined();
    });
  });

  describe('onVaultError', () => {
    it('should route to landing page on error code 8', () => {
      const error: VaultError = {
        code: 8,
        message: '',
      };
      service.onVaultError(error);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('landing');
    });

    it('should route to landing page on error code 13', () => {
      const error: VaultError = {
        code: 13,
        message: '',
      };
      service.onVaultError(error);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('landing');
    });
  });

  describe('isFaceIDAvailableOnDevice', () => {
    it('should return true if faceid is both available and enabled', async () => {
      spyOn(Device, 'isBiometricsSupported').and.returnValue(
        Promise.resolve(true)
      );
      spyOn(Device, 'isBiometricsEnabled').and.returnValue(
        Promise.resolve(true)
      );

      const result = await service.isFaceIDAvailableOnDevice();

      expect(Device.isBiometricsSupported).toHaveBeenCalled();
      expect(Device.isBiometricsEnabled).toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('should return false if faceid is only available and not enabled', async () => {
      spyOn(Device, 'isBiometricsSupported').and.returnValue(
        Promise.resolve(true)
      );
      spyOn(Device, 'isBiometricsEnabled').and.returnValue(
        Promise.resolve(false)
      );

      const result = await service.isFaceIDAvailableOnDevice();

      expect(Device.isBiometricsSupported).toHaveBeenCalled();
      expect(Device.isBiometricsEnabled).toHaveBeenCalled();
      expect(result).toBeFalse();
    });
  });

  describe('setDefaultFaceIDDisabled', () => {
    it('should call localstorage setItem', () => {
      spyOn(Storage.prototype, 'setItem');

      service.setDefaultFaceIDDisabled(true);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'default_faceid_disabled_flag',
        'true'
      );
    });
  });

  describe('defaultFaceIDDisabled', () => {
    it('should call localstorage getItem', () => {
      spyOn(Storage.prototype, 'getItem');

      service.defaultFaceIDDisabled();
      expect(Storage.prototype.getItem).toHaveBeenCalledWith(
        'default_faceid_disabled_flag'
      );
    });
  });

  describe('enableFaceID', () => {
    beforeEach(() => {
      spyOn(Storage.prototype, 'setItem');
    });

    it('should enable faceid on vault config and return true when faceid is available', async () => {
      spyOn(service, 'isFaceIDAvailableOnDevice').and.returnValue(
        Promise.resolve(true)
      );

      const result = await service.enableFaceID();

      expect(service.isFaceIDAvailableOnDevice).toHaveBeenCalled();
      expect(vaultSpy.updateConfig).toHaveBeenCalledWith(biometricsVaultConfig);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'vault_config',
        JSON.stringify(biometricsVaultConfig)
      );
      expect(result).toBeTrue();
    });

    it('should not enable faceid and return false if isFaceIDAvailableOnDevice is false', async () => {
      spyOn(service, 'isFaceIDAvailableOnDevice').and.returnValue(
        Promise.resolve(false)
      );

      const result = await service.enableFaceID();

      expect(service.isFaceIDAvailableOnDevice).toHaveBeenCalled();
      expect(vaultSpy.updateConfig).not.toHaveBeenCalled();

      expect(Storage.prototype.setItem).not.toHaveBeenCalledWith(
        'vault_config',
        JSON.stringify(biometricsVaultConfig)
      );
      expect(result).toBeFalse();
    });
  });

  describe('disableFaceID', () => {
    it('should disable faceid', async () => {
      spyOn(Storage.prototype, 'setItem');

      await service.disableFaceID();
      expect(vaultSpy.updateConfig).toHaveBeenCalledWith(defaultVaultConfig);
      expect(Storage.prototype.setItem).toHaveBeenCalledWith(
        'vault_config',
        JSON.stringify(defaultVaultConfig)
      );
    });
  });

  describe('clearVault', () => {
    it('should call vault clear', async () => {
      await service.clearVault();
      expect(vaultSpy.clear).toHaveBeenCalled();
    });
  });

  describe('isFaceIDEnabled', () => {
    it('should return true if faceid enabled', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(biometricsVaultConfig)
      );
      const result = service.isFaceIDEnabled();
      expect(result).toBeTrue();
    });

    it('should return false if faceid not enabled', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(
        JSON.stringify(defaultVaultConfig)
      );
      const result = service.isFaceIDEnabled();
      expect(result).toBeFalse();
    });

    it('should return false if vault config is null', () => {
      spyOn(Storage.prototype, 'getItem').and.returnValue(null);
      const result = service.isFaceIDEnabled();
      expect(result).toBeFalse();
    });
  });

  describe('isLocked', () => {
    it('should return vault.isLocked', async () => {
      vaultSpy.isLocked.and.returnValue(Promise.resolve(true));

      const result = await service.isLocked();

      expect(vaultSpy.isLocked).toHaveBeenCalled();
      expect(result).toBeTrue();
    });
  });

  describe('lockVault', () => {
    it('should call vault.lock', async () => {
      await service.lockVault();
      expect(vaultSpy.lock).toHaveBeenCalled();
    });
  });

  describe('unlockVault', () => {
    it('should call vault.lock', async () => {
      await service.unlockVault();
      expect(vaultSpy.unlock).toHaveBeenCalled();
    });
  });

  describe('hasStoredSession', () => {
    it('should call vault.lock', async () => {
      vaultSpy.doesVaultExist.and.returnValue(Promise.resolve(true));

      const result = await service.hasStoredSession();
      expect(vaultSpy.doesVaultExist).toHaveBeenCalled();
      expect(result).toEqual(true);
    });
  });
});
