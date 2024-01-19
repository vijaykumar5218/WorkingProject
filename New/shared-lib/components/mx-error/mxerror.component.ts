import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {
  MXRootMemberObject,
  Member,
} from '@shared-lib/services/mx-service/models/mx.model';
import * as mxErrorContent from './constants/content.json';
import {Subscription} from 'rxjs';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {PlatformService} from '@shared-lib/services/platform/platform.service';

@Component({
  selector: 'app-mxerror',
  templateUrl: './mxerror.component.html',
  styleUrls: ['./mxerror.component.scss'],
})
export class MXErrorComponent implements OnInit, OnDestroy {
  @Input() noLeftPadding: boolean;
  content = mxErrorContent;
  hasMXError = false;
  subscription = new Subscription();
  isWeb: boolean;
  isDesktop: boolean;
  isMxUser: boolean;
  mxErrorHidden = false;

  constructor(
    private mxService: MXService,
    private utilityService: SharedUtilityService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.subscription.add(
      this.mxService.getIsMxUserByMyvoyageAccess().subscribe(data => {
        this.isMxUser = data;
        if (!this.isWeb || this.isMxUser) {
          this.checkForErrors();
        }
      })
    );
    this.platformService.isDesktop().subscribe(data => {
      this.isDesktop = data;
    });
  }

  checkForErrors() {
    this.subscription.add(
      this.mxService.isMxErrorHidden().subscribe((mxErrorHidden: boolean) => {
        this.mxErrorHidden = mxErrorHidden;
      })
    );
    this.subscription.add(
      this.mxService
        .getMxMemberConnect()
        .subscribe((memConnect: MXRootMemberObject) => {
          this.hasMXError = false;
          memConnect.members.forEach((account: Member) => {
            if (
              account.connection_status != null &&
              account.connection_status !== 'CONNECTED'
            ) {
              this.hasMXError = true;
            }
          });
        })
    );
  }

  closeClicked() {
    this.mxService.setMxErrorHidden(true);
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
