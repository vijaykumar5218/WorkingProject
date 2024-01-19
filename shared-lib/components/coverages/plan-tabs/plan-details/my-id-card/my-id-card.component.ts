import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {IdCardContent} from './models/idCardModel';
import idCard from './constants/idCard.json';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Router} from '@angular/router';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {ModalController} from '@ionic/angular';
import {trigger, state, style, transition, animate} from '@angular/animations';
import {Subscription} from 'rxjs';
import {MyIDCard} from '@shared-lib/services/benefits/models/benefits.model';
import {DeleteModalContent} from './card-modal/constants/delete.model';
import pageText from './card-modal/constants/pageText.json';
import {ImageModal} from './image-modal/image-modal.page';
import {CardModalComponent} from './card-modal/card-modal.component';
@Component({
  selector: 'app-my-id-card',
  templateUrl: './my-id-card.component.html',
  styleUrls: ['./my-id-card.component.scss'],
  animations: [
    trigger('flipState', [
      state(
        'back',
        style({
          transform: 'rotateY(179deg)',
        })
      ),
      state(
        'front',
        style({
          transform: 'rotateY(0)',
        })
      ),
      transition('back => front', animate('500ms ease-out')),
      transition('front => back', animate('500ms ease-in')),
    ]),
  ],
})
export class MyIdCardComponent implements OnInit {
  content: IdCardContent = idCard;
  cardImage: MyIDCard = {
    cardFront: '',
    cardBack: '',
  };
  flip = 'front';
  private subscription = new Subscription();
  deleteContent: DeleteModalContent = pageText;
  @Input() benefitId: string;
  private benefitCards: Record<string, MyIDCard>;
  private firstLoad = true;
  isWeb = false;

  constructor(
    private utilService: SharedUtilityService,
    private router: Router,
    private modalController: ModalController,
    private benefit: BenefitsService
  ) {
    this.isWeb = this.utilService.getIsWeb();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.benefitId) {
      this.setCardImages();
    }
  }

  addACard() {
    if (this.utilService.getIsWeb()) {
      const selectedBenefit = this.benefit.getSelectedBenefit();
      this.router.navigateByUrl(
        '/coverages/view-plans/' + selectedBenefit.id + '/details/add-card'
      );
    } else {
      this.router.navigateByUrl('/coverages/plan-tabs/add-card');
    }
  }

  private setCardImages() {
    if (this.benefitId && this.benefitCards) {
      this.cardImage.cardFront =
        this.benefitCards[this.benefitId]?.cardFront || '';
      this.cardImage.cardBack =
        this.benefitCards[this.benefitId]?.cardBack || '';
      if (
        this.cardImage.cardFront === '' &&
        this.cardImage.cardBack === '' &&
        this.firstLoad
      ) {
        this.benefit.getIdCard();
      }
      this.firstLoad = false;
    }
  }

  ngOnInit(): void {
    this.subscription.add(
      this.benefit
        .getCardImages()
        .subscribe((res: Record<string, MyIDCard>) => {
          this.benefitCards = res;
          this.setCardImages();
        })
    );
    this.subscription.add(
      this.benefit.getFlipCardSubject().subscribe((res: string) => {
        this.flip = res;
      })
    );
  }

  toggleFlip() {
    this.benefit.flipCard(this.flip);
  }

  private async showModal(componentProps: Record<string, string | boolean>) {
    const modal = await this.modalController.create({
      component: CardModalComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: componentProps,
    });
    modal.present();
  }

  async showIdCard(img: string) {
    const modal = await this.modalController.create({
      component: ImageModal,
      cssClass: 'id-image-viewer',
      componentProps: {
        img,
      },
    });
    modal.present();
  }

  deleteImage() {
    this.showModal({
      header: this.deleteContent.titleMessage,
      yesText: this.deleteContent.yes,
      noText: this.deleteContent.no,
      delete: true,
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
