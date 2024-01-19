import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ViewWillEnter} from '@ionic/angular';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import * as PageText from './constants/financial-summary-content.json';
import {MXService} from '@shared-lib/services/mx-service/mx.service';

@Component({
  selector: 'app-financial-summary',
  styleUrls: ['./financial-summary-page.scss'],
  templateUrl: './financial-summary.page.html',
})
export class FinancialSummaryPage implements OnInit, ViewWillEnter {
  readonly widgetType = WidgetType;
  pageText = (PageText as any).default;
  height: string;
  @ViewChild('container', {read: ElementRef, static: true})
  contentView: ElementRef;

  constructor(
    private headerFooterService: HeaderFooterTypeService,
    private mxService: MXService
  ) {}

  ngOnInit(): void {
    this.height = this.contentView.nativeElement.offsetHeight + 30 + 'px';
  }

  ionViewWillEnter(): void {
    this.headerFooterService.publishType(
      {
        type: HeaderType.navbar,
        actionOption: {
          headername: this.pageText.header,
          btnleft: true,
          buttonLeft: {
            name: this.pageText.back,
            link: 'home',
          },
        },
      },
      {type: FooterType.none}
    );
  }

  ionViewDidEnter(): void {
    this.mxService.addMXWindowEventListener();
  }

  ionViewWillLeave(): void {
    this.mxService.removeMXWindowEventListener();
  }
}
