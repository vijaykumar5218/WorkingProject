import {Component, OnInit} from '@angular/core';
import {LandingService} from '@mobile/app/modules/features/landing/service/landing.service';
import * as PageText from './constants/no-access-content.json';
import {AuthenticationService} from '@mobile/app/modules/shared/service/authentication/authentication.service';
import {LoadingController} from '@ionic/angular';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {NoAccessMessage} from '@mobile/app/modules/features/landing/models/landing.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {WebLogoutService} from '@web/app/modules/shared/services/logout/logout.service';
@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.page.html',
  styleUrls: ['./no-access.page.scss'],
})
export class NoAccessPage implements OnInit {
  pageText: Record<string, string> = (PageText as any).default;
  messages: NoAccessMessage;
  isWeb: boolean;

  constructor(
    private landingService: LandingService,
    private baseService: BaseService,
    private authService: AuthenticationService,
    private loadingController: LoadingController,
    private utilityService: SharedUtilityService,
    private webLogoutService: WebLogoutService
  ) {}

  async ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    if (this.isWeb) {
      this.webLogoutService.setTerminatedUser(true);
      this.webLogoutService.constructLogoutURL();
    }
    this.messages = await this.landingService.getNoAccessMessage();
  }

  async closeClicked() {
    if (this.isWeb) {
      this.webLogoutService.action();
    } else {
      const loader = await this.loadingController.create({
        translucent: true,
      });
      loader.present();
      await this.authService.logoutAndRevoke();
      this.baseService.navigateByUrl('landing');
      loader.dismiss();
    }
  }
}
