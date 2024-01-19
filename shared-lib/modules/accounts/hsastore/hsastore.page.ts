import {Component, OnInit} from '@angular/core';
import {AccountService} from '@shared-lib/services/account/account.service';
import {HSAorFSA} from '@shared-lib/services/account/models/all-accounts.model';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import * as pageText from './constants/pageText.json';

@Component({
  selector: 'app-hsastore',
  templateUrl: './hsastore.page.html',
  styleUrls: ['./hsastore.page.scss'],
})
export class HSAStorePage implements OnInit {
  pageText: Record<string, string> = pageText;
  currentStore: 'fsa' | 'hsa' = 'hsa';
  hsaOrFsa: HSAorFSA;
  isWeb = false;

  constructor(
    private utilityService: SharedUtilityService,
    private accountService: AccountService
  ) {
    this.isWeb = this.utilityService.getIsWeb();
  }

  ngOnInit(): void {
    this.accountService.getHSAorFSA().then(horf => {
      this.hsaOrFsa = horf;
      if (horf.hsa) {
        this.currentStore = 'hsa';
      } else if (horf.fsa) {
        this.currentStore = 'fsa';
      }
    });
  }

  onSegmentChange(event: any) {
    this.currentStore = event.detail.value;
  }
}
