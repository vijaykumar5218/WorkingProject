import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import * as pageContent from './constants/content.json';
import {PageContent} from './constants/model';
import {card} from '@shared-lib/components/coverages/plan-tabs/plan-details/my-id-card/constants/camera.enum';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {MyIDCard} from '@shared-lib/services/benefits/models/benefits.model';
import {Subscription} from 'rxjs';
@Component({
  selector: 'mobile-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
})
export class AddCardComponent implements OnInit {
  constructor(private location: Location, private benefit: BenefitsService) {}
  pageContent: PageContent = pageContent;
  cardSide = card;
  loading: boolean;
  private subscription = new Subscription();
  cardFront = '';
  cardBack = '';

  ngOnInit(): void {
    let firstLoad = true;
    this.subscription.add(
      this.benefit
        .getCardImages()
        .subscribe((res: Record<string, MyIDCard>) => {
          const selectedBenefit = this.benefit.getSelectedBenefit();
          this.cardFront = res[selectedBenefit.id]?.cardFront || '';
          this.cardBack = res[selectedBenefit.id]?.cardBack || '';

          if (this.cardFront === '' && this.cardBack === '' && firstLoad) {
            this.benefit.getIdCard();
          }
          firstLoad = false;
        })
    );
  }

  addCard(imgBase64: string, cardSide: card) {
    this.cardFront = cardSide === card.FRONT ? imgBase64 : this.cardFront;
    this.cardBack = cardSide === card.BACK ? imgBase64 : this.cardBack;
  }

  async uploadCard() {
    const newCard: MyIDCard = {
      cardFront: this.benefit.trimBase64MetaData(this.cardFront),
      cardBack: this.benefit.trimBase64MetaData(this.cardBack),
    };
    this.loading = !this.loading;
    await this.benefit.uploadMyIdCard(newCard);
    this.loading = false;
    this.close();
  }

  close() {
    this.benefit.flipCard('back');
    this.location.back();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
