import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Input,
  ViewChild,
} from '@angular/core';
import {ViewWillEnter, ViewWillLeave, ModalController} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {MXRootObject} from '@shared-lib/services/mx-service/models/mx.model';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import * as PageText from './constants/add-accounts-content.json';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {HeaderFooterTypeService} from '../../../services/header-footer-type/headerFooterType.service';
import {HeaderType} from '../../../constants/headerType.enum';
import {AccountService} from '@shared-lib/services/account/account.service';

@Component({
  selector: 'app-add-accounts',
  styleUrls: ['./add-accounts.page.scss'],
  templateUrl: './add-accounts.page.html',
})
export class AddAccountsPage
  implements OnInit, ViewWillEnter, ViewWillLeave, OnDestroy, AfterViewInit {
  @Input() showCancel: boolean;
  @Input() preInitHeight: string;
  readonly widgetType = WidgetType;
  pageText = (PageText as any).default;
  height: string;
  isWeb: boolean;
  mxWidgetUrl: MXRootObject;
  @ViewChild('container', {read: ElementRef, static: true})
  contentView: ElementRef;
  private subscription = new Subscription();
  private backRoute = '/account/summary';

  constructor(
    private headerFooterService: HeaderFooterTypeService,
    private mxService: MXService,
    private sharedUtilityService: SharedUtilityService,
    private activatedRoute: ActivatedRoute,
    private journeyService: JourneyService,
    private modalController: ModalController,
    private accountService: AccountService
  ) {
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  ngOnInit() {
    if (this.contentView.nativeElement.offsetHeight) {
      this.height = this.contentView.nativeElement.offsetHeight + 30 + 'px';
    } else {
      this.height = '750px';
    }
    if (this.preInitHeight) {
      this.height = this.preInitHeight;
    }

    const activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(
      data => {
        if (data.backRoute) {
          this.backRoute = data.backRoute;
        }
      }
    );
    this.subscription.add(activatedRouteSubscription);
  }

  ionViewWillEnter(): void {
    if (!this.isWeb) {
      this.headerFooterService.publishType(
        {
          type: HeaderType.navbar,
          actionOption: {
            headername: this.pageText.header,
            btnleft: true,
            buttonLeft: {
              name: this.pageText.back,
              link: this.backRoute,
            },
          },
        },
        {type: FooterType.none}
      );
    }
  }

  ngAfterViewInit(): void {
    this.mxService.addMXWindowEventListener();
  }

  closeModal() {
    this.mxService.getIsMxUserByMyvoyageAccess(true);
    this.sharedUtilityService.setSuppressHeaderFooter(false);
    this.modalController.dismiss();
  }

  ionViewWillLeave(): void {
    this.journeyService.setRefreshMxAccount('true');
    this.mxService.getMxMemberConnect(true);
    this.mxService.getMxAccountConnect(true);
    this.accountService.getAggregatedAccounts(this.mxService.getUserAccountUpdate());
    this.mxService.removeMXWindowEventListener();
    this.mxService.getIsMxUserByMyvoyageAccess(true);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
