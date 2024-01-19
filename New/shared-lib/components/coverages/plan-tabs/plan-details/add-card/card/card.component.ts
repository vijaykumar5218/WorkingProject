import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import * as pageContent from './constants/content.json';
import {PageContent} from './constants/model';
import {
  card,
  upload_from,
} from '@shared-lib/components/coverages/plan-tabs/plan-details/my-id-card/constants/camera.enum';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {ActionSheetController, ModalController, Platform} from '@ionic/angular';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
  PermissionStatus,
} from '@capacitor/camera';
import {CardModalComponent} from '../../my-id-card/card-modal/card-modal.component';
import PhotoCropping, {
  PhotoCroppingPlugin,
} from 'mobile/customPlugins/photoCroppingPlugin';

@Component({
  selector: 'card-component',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements AfterViewInit {
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  pageContent: PageContent = pageContent;
  @Input() side: string;
  @Output() fileBase64 = new EventEmitter<string>();
  cardSide = card;
  imgUrl: string;
  @Input() imageBase64: string;
  isWeb: boolean;
  private camera = Camera;
  photoCropping: PhotoCroppingPlugin;

  constructor(
    private benefit: BenefitsService,
    private utilService: SharedUtilityService,
    private actionSheetCtrl: ActionSheetController,
    private modalController: ModalController,
    private platform: Platform
  ) {
    this.photoCropping = PhotoCropping;
  }

  ngOnInit() {
    this.isWeb = this.utilService.getIsWeb();
  }

  ngAfterViewInit(): void {
    this.imgUrl = this.imageBase64
      ? this.benefit.appendBase64MetaData(this.imageBase64)
      : undefined;
  }

  openFileBrowser() {
    if (this.isWeb) {
      this.fileInput.nativeElement.click();
    } else {
      this.presentActionSheet();
    }
  }

  selectFile(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const imageData = reader.result as string;
      this.imgUrl = imageData;
      const base64Image = this.benefit.trimBase64MetaData(imageData);
      this.fileBase64.emit(base64Image);
    };
  }

  changeCard() {
    this.openFileBrowser();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: this.pageContent.actionsheet.fromPhotos,
          handler: () => {
            this.startLoader(upload_from.PHOTOS);
          },
        },
        {
          text: this.pageContent.actionsheet.fromCamera,
          handler: () => {
            this.startLoader(upload_from.CAMERA);
          },
        },
        {
          text: this.pageContent.actionsheet.cancel,
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
  async startLoader(type: upload_from) {
    const permission = await this.checkPermissionAndRequest(type);
    if (permission) {
      this.load(type);
    }
  }

  private async load(type: upload_from) {
    const image = await this.openSource(type);
    if (image) {
      let img = image.base64String;
      if (this.platform.is('ios') && type === upload_from.CAMERA) {
        img = (await this.photoCropping.cropPhoto({image: img})).image;
      }

      this.imgUrl = 'data:image/jpeg;base64,' + img;
      this.fileBase64.emit(img);
    }
  }

  async openSource(type: upload_from): Promise<Photo | undefined> {
    try {
      const image: Photo = await this.camera.getPhoto({
        quality: 90,
        allowEditing: !this.platform.is('ios'),
        source:
          type === upload_from.CAMERA
            ? CameraSource.Camera
            : CameraSource.Photos,
        resultType: CameraResultType.Base64,
      });

      return image;
    } catch (error) {
      return undefined;
    }
  }

  private async checkPermissionAndRequest(type: upload_from) {
    const permission = await this.camera.checkPermissions();
    const permissionType = type === upload_from.CAMERA ? 'camera' : 'photos';
    let result = await this.checkPermission(permission, type);
    if (!result && permission[permissionType] !== 'denied') {
      const requestPermission = await this.camera.requestPermissions({
        permissions: [permissionType],
      });
      result = await this.checkPermission(requestPermission, type);
    }
    return result;
  }

  private async checkPermission(
    permission: PermissionStatus,
    type: string
  ): Promise<boolean> {
    let result = false;
    if (permission[type] === 'granted' || permission[type] === 'limited') {
      result = true;
    } else if (permission[type] === 'denied') {
      const header =
        (type === 'camera' ? 'Camera' : 'Photo library') +
        ' permission is denied';

      const description =
        'Please enable ' +
        (type === 'camera' ? 'camera' : 'photo library') +
        ' permission from the device settings of the app to use this feature.';
      this.showModal({
        yesText: 'Okay',
        description: description,
        header: header,
      });
    }
    return result;
  }
  private async showModal(componentProps: Record<string, string | boolean>) {
    const modal = await this.modalController.create({
      component: CardModalComponent,
      cssClass: 'modal-not-fullscreen',
      componentProps: componentProps,
    });
    modal.present();
  }
}
