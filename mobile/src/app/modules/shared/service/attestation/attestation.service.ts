import {Injectable} from '@angular/core';
import {CapAttestation, CapAttestationPlugin} from 'capacitor-attestation';
import {AuthenticationService} from '../authentication/authentication.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {endpoints} from './constants/endpoints';
import {Environment} from '@shared-lib/models/environment.model';

@Injectable({
  providedIn: 'root',
})
export class AttestationService {
  endPoints = endpoints;
  private attest: CapAttestationPlugin;
  environment: Environment;

  constructor(
    private authService: AuthenticationService,
    private utilityService: SharedUtilityService
  ) {
    this.environment = this.utilityService.getEnvironment();
    this.attest = CapAttestation;
    this.endPoints = this.utilityService.appendBaseUrlToEndpoints(
      this.endPoints,
      this.utilityService.getEnvironment().tokenBaseUrl
    );
  }

  async attestApplication(): Promise<boolean> {
    const token = await this.authService.getAccessToken();
    const attestResult = await this.attest.attestApplication({
      attestationUrl: this.endPoints.attestationEndpoint,
      token: token,
    });
    return attestResult.success;
  }
}
