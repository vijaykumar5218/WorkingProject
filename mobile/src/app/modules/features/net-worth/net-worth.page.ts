import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ViewWillEnter} from '@ionic/angular';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import * as nwContent from './constants/net-worth-page-content.json';

@Component({
  selector: 'app-net-worth-widget',
  styleUrls: ['./net-worth.page.scss'],
  templateUrl: './net-worth.page.html',
})
export class NetWorthPage implements OnInit, ViewWillEnter {
  readonly widgetType = WidgetType;
  netWorthContent = (nwContent as any).default;
  height: string;
  @ViewChild('container', {read: ElementRef, static: true})
  contentView: ElementRef;

  constructor(private headerFooterService: HeaderFooterTypeService) {}

  ngOnInit(): void {
    this.height = this.contentView.nativeElement.offsetHeight + 30 + 'px';
  }

  ionViewWillEnter(): void {
    this.headerFooterService.publishType(
      {
        type: HeaderType.navbar,
        actionOption: {
          headername: this.netWorthContent.header,
          btnleft: true,
          buttonLeft: {
            name: this.netWorthContent.back,
            link: 'back',
          },
        },
      },
      {type: FooterType.none}
    );
  }
}
