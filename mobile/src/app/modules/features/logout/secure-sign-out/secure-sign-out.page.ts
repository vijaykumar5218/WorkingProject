import {Component, OnInit} from '@angular/core';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '../../../../../../../shared-lib/services/header-footer-type/headerFooterType.service';
import * as text from './constants/secure-sign-out-content.json';

@Component({
  selector: 'app-secure-sign-out',
  templateUrl: './secure-sign-out.page.html',
  styleUrls: ['./secure-sign-out.page.scss'],
})
export class SecureSignOutPage implements OnInit {
  pageText: Record<string, string> = text;
  hasFaceIDSession = false;
  isTimeoutLogout = false;

  constructor(private headerFooterTypeService: HeaderFooterTypeService) {}

  ngOnInit(): void {
    this.headerFooterTypeService.publishType(
      {type: HeaderType.none},
      {type: FooterType.none}
    );
  }
}
