import {Component, OnInit} from '@angular/core';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import * as text from './constants/notification.json';
import {Notification} from '@shared-lib/services/notification/models/notification.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActivatedRoute} from '@angular/router';
import {HeaderType} from '../../constants/headerType.enum';
import {ActionOptions} from '../../models/ActionOptions.model';
import {HeaderTypeService} from '../../services/header-type/header-type.service';
import {NotificationService} from '../../services/notification/notification.service';

@Component({
  selector: 'app-shared-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  pageText: Record<string, string> = JSON.parse(JSON.stringify(text)).default;
  actionOption: ActionOptions = {
    headername: this.pageText.pageTitle,
    btnright: false,
    btnleft: true,
    buttonLeft: {
      name: '',
      link: 'back',
    },
  };
  notifications: Notification;
  isWeb: boolean;
  previousRootPath: string;

  constructor(
    private footerType: FooterTypeService,
    private headerType: HeaderTypeService,
    private notificationService: NotificationService,
    private sharedUtilityService: SharedUtilityService,
    private activatedRoute: ActivatedRoute
  ) {
    this.isWeb = this.sharedUtilityService.getIsWeb();
  }

  ngOnInit() {
    if (this.isWeb) {
      this.getNotificationData();
    }

    this.footerType.publish(null);
    if (this.isWeb) {
      this.activatedRoute.queryParams.subscribe(data => {
        this.previousRootPath = data.previousRootPath;
      });
    }
  }

  async getNotificationData() {
    this.notifications = await this.notificationService.getNotification();
    this.notificationService.savePageVisit();
  }

  ionViewWillEnter() {
    this.getNotificationData();
    this.headerType.publish({
      type: HeaderType.navbar,
      actionOption: this.actionOption,
    });
  }

  ngOnDestroy() {
    if (this.isWeb) {
      if (this.previousRootPath) {
        this.footerType.publish({
          type: FooterType.tabsnav,
          selectedTab: this.previousRootPath,
        });
      } else {
        this.footerType.publish(null);
      }
    } else {
      this.footerType.publish({type: FooterType.tabsnav});
    }
  }
}
