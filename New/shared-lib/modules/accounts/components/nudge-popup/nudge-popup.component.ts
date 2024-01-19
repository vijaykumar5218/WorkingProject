import {Component, OnInit} from '@angular/core';
import {NavParams, ModalController} from '@ionic/angular';
import {AccountService} from '@shared-lib/services/account/account.service';
import * as pageText from '@shared-lib/services/account/models/retirement-account/info/info-tab.json';
import {take} from 'rxjs/operators';
import {PeopleLikeYouObject} from './model/nudge-popup.model';

@Component({
  selector: 'app-nudge-popup',
  templateUrl: './nudge-popup.component.html',
  styleUrls: ['./nudge-popup.component.scss'],
})
export class NudgePopupComponent implements OnInit {
  url: string[];
  tooltipNote: string;
  nudgeType: string;
  stringNum: string[];
  urlConcat: string;
  peopleLikeYouObj: PeopleLikeYouObject;
  pageText: any = JSON.parse(JSON.stringify(pageText)).default;

  constructor(
    public params: NavParams,
    private modalController: ModalController,
    private accountService: AccountService
  ) {
    this.url = this.params.get('url');
    this.tooltipNote = this.params.get('toolTipNote');
    this.nudgeType = this.params.get('nudgeType');
  }

  ngOnInit() {
    this.createMatchNudge();
  }

  createMatchNudge() {
    if (this.nudgeType === 'COMPAREME') {
      this.urlConcat = this.tooltipNote;
      this.peopleLikeYouObj = {
        header: this.getStringFromHtmlTag(this.urlConcat, 'h1')[0],
        points: this.getColorNumber(
          this.getStringFromHtmlTag(this.urlConcat, 'ul')[0]
        ),
        subHeader: this.getColorNumber(
          this.getStringFromHtmlTag(this.urlConcat, 'h1')[1]
        ),
        desc: this.getStringFromHtmlTag(this.urlConcat, 'p')[0],
      };
    } else {
      this.urlConcat = this.url[0] + this.url[1];
      const finalString = this.getColorNumber(this.urlConcat);
      this.urlConcat = finalString;
    }
  }

  getColorNumber(urlConcat: string): string {
    const stringNum = urlConcat.match(/(\$\d+(.\d+)?)|(\d*[.]\d\d)|([\d*%])/g);
    let restOfString = urlConcat;
    let finalString = '';
    stringNum.forEach((str: string) => {
      const splitStrings = restOfString.split(str);
      finalString +=
        splitStrings[0] + '<span class="font-orange">' + str + '</span>';
      restOfString = splitStrings.slice(1).join(str);
    });
    return finalString + ' ' + restOfString;
  }

  getStringFromHtmlTag(str: string, htmlTagName: string): Array<string> {
    const tempString = [];
    const div = document.createElement(htmlTagName);
    div.innerHTML = str;
    Array.from(div.querySelectorAll(htmlTagName)).forEach(function(divEle) {
      tempString.push(divEle.innerHTML);
    });
    return tempString;
  }

  openMatch() {
    if (this.nudgeType === 'COMPAREME') {
      this.closeDialog();
    } else {
      this.accountService
        .getExternalLinks()
        .pipe(take(1))
        .subscribe(externalLinks => {
          const link = externalLinks.find(l => {
            return l.id === 'ACCT_CONTRIB';
          });
          this.accountService.openPwebAccountLink(
            decodeURIComponent(link.link)
          );
        });
    }
  }

  closeDialog() {
    this.modalController.dismiss();
  }
}
