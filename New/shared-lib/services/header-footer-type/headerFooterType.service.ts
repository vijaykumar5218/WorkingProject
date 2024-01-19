import {Injectable} from '@angular/core';
import {FooterInfo} from '@shared-lib/modules/footer/models/footerInfo.model';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {HeaderInfo} from '../../models/headerInfo.model';
import {HeaderTypeService} from '../header-type/header-type.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderFooterTypeService {
  constructor(
    private headerTypeService: HeaderTypeService,
    private footerTypeService: FooterTypeService
  ) {}

  publishType(headerInfo: HeaderInfo, footerInfo: FooterInfo): void {
    this.headerTypeService.publish(headerInfo);
    this.footerTypeService.publish(footerInfo);
  }
}
