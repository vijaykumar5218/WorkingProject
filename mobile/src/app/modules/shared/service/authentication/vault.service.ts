import {Injectable, NgZone} from '@angular/core';
import {
  BrowserVault,
  Device,
  Vault,
  VaultType,
  IdentityVaultConfig,
  VaultError,
} from '@ionic-enterprise/identity-vault';
import {Capacitor} from '@capacitor/core';
import {Router} from '@angular/router';
import {
  biometricsVaultConfig,
  defaultVaultConfig,
} from './contants/authConstants';

export const VAULT_CONFIG_KEY = 'vault_config';
export const DEFAULT_FACEID_DISABLED = 'default_faceid_disabled_flag';

@Injectable({
  providedIn: 'root',
})
export class VaultService {
  vault: Vault | BrowserVault;
  otherVault: Vault | BrowserVault;

  constructor(private router: Router, private ngZone: NgZone) {}

  async initializeVault() {
    let vaultConfig: IdentityVaultConfig = JSON.parse(
      localStorage.getItem(VAULT_CONFIG_KEY)
    );
    if (!vaultConfig) {
      vaultConfig = defaultVaultConfig;
    }

    this.vault = Capacitor.isNativePlatform()
      ? new Vault(vaultConfig)
      : new BrowserVault(vaultConfig);

    this.vault.onError(this.onVaultError.bind(this));
  }

  async onVaultError(error: VaultError) {
    if (error.code == 8 || error.code == 13) {
      this.ngZone.run(() => {
        this.router.navigateByUrl('landing');
      });
    }
  }

  async isFaceIDAvailableOnDevice(): Promise<boolean> {
    const isBiometricSupport = await Device.isBiometricsSupported();
    const isBiometricEnabled = await Device.isBiometricsEnabled();
    if (isBiometricSupport && isBiometricEnabled) {
      return true;
    } else {
      return false;
    }
  }

  setDefaultFaceIDDisabled(flag: boolean) {
    localStorage.setItem(DEFAULT_FACEID_DISABLED, flag.toString());
  }

  defaultFaceIDDisabled(): boolean {
    return localStorage.getItem(DEFAULT_FACEID_DISABLED) === 'true';
  }

  async enableFaceID(): Promise<boolean> {
    if (await this.isFaceIDAvailableOnDevice()) {
      await this.vault.updateConfig(biometricsVaultConfig);
      localStorage.setItem(
        VAULT_CONFIG_KEY,
        JSON.stringify(biometricsVaultConfig)
      );
      return true;
    }
    return false;
  }

  async disableFaceID(): Promise<void> {
    await this.vault.updateConfig(defaultVaultConfig);
    localStorage.setItem(VAULT_CONFIG_KEY, JSON.stringify(defaultVaultConfig));
  }

  async clearVault() {
    await this.vault.clear();
  }

  isFaceIDEnabled(): boolean {
    const vaultConfig: IdentityVaultConfig = JSON.parse(
      localStorage.getItem(VAULT_CONFIG_KEY)
    );
    if (!vaultConfig) {
      return false;
    }
    return vaultConfig.type === VaultType.DeviceSecurity;
  }

  isLocked(): Promise<boolean> {
    return this.vault.isLocked();
  }

  async lockVault(): Promise<void> {
    await this.vault.lock();
  }

  async unlockVault(): Promise<void> {
    await this.vault.unlock();
  }

  hasStoredSession(): Promise<boolean> {
    return this.vault.doesVaultExist();
  }
}
