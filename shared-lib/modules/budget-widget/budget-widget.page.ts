import {Component, ElementRef, ViewChild} from '@angular/core';
import {ViewWillEnter} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {BudgetWidgetContent} from './models/budget-widget.page.model';
import * as pageText from './constants/budget-widget-constants.json';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {HeaderFooterTypeService} from '../../services/header-footer-type/headerFooterType.service';
import {HeaderType} from '../../constants/headerType.enum';
@Component({
  selector: 'app-module-budget-widget',
  styleUrls: ['./budget-widget.page.scss'],
  templateUrl: './budget-widget.page.html',
})
export class BudgetWidgetPage implements ViewWillEnter {
  readonly widgetType = WidgetType;
  budgetText: BudgetWidgetContent = JSON.parse(JSON.stringify(pageText))
    .default;
  @ViewChild('container', {read: ElementRef, static: true})
  contentView: ElementRef;
  height: string;
  isWeb: boolean;

  constructor(
    private headerFooterService: HeaderFooterTypeService,
    private utilityService: SharedUtilityService
  ) {}

  ngOnInit(): void {
    this.isWeb = this.utilityService.getIsWeb();
    this.height = this.isWeb
      ? '1200px'
      : this.contentView.nativeElement.offsetHeight + 30 + 'px';
  }

  ionViewWillEnter(): void {
    if (!this.isWeb) {
      this.headerFooterService.publishType(
        {
          type: HeaderType.navbar,
          actionOption: {
            headername: this.budgetText.header,
            btnleft: true,
            buttonLeft: {
              name: this.budgetText.back,
              link: 'account',
            },
          },
        },
        {type: FooterType.none}
      );
    }
  }
}
