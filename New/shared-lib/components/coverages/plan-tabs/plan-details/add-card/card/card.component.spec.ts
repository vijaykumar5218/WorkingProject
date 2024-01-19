import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {
  ActionSheetController,
  IonicModule,
  ModalController,
  Platform,
} from '@ionic/angular';

import {CardComponent} from './card.component';
import {BenefitsService} from '@shared-lib/services/benefits/benefits.service';
import pageContent from './constants/content.json';
import {PermissionStatus} from '@capacitor/camera';
import {upload_from} from '@shared-lib/components/coverages/plan-tabs/plan-details/my-id-card/constants/camera.enum';
import {CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {CardModalComponent} from '../../my-id-card/card-modal/card-modal.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let benefitSerivceSpy;
  let actionSheetControllerSpy;
  let cameraSpy;
  let utilServiceSpy;
  let modalControllerSpy;
  let platformSpy;
  let photoCroppingPluginSpy;

  beforeEach(
    waitForAsync(() => {
      utilServiceSpy = jasmine.createSpyObj('utilServiceSpy', ['getIsWeb']);
      benefitSerivceSpy = jasmine.createSpyObj('BenefitService', [
        'appendBase64MetaData',
        'trimBase64MetaData',
      ]);
      actionSheetControllerSpy = jasmine.createSpyObj('ActionSheetController', [
        'create',
      ]);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      platformSpy = jasmine.createSpyObj('Platform', ['is']);
      TestBed.configureTestingModule({
        declarations: [CardComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: BenefitsService, useValue: benefitSerivceSpy},
          {provide: SharedUtilityService, useValue: utilServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
          {provide: ActionSheetController, useValue: actionSheetControllerSpy},
          {provide: Platform, useValue: platformSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CardComponent);
      component = fixture.componentInstance;
      cameraSpy = jasmine.createSpyObj('camera', [
        'getPhoto',
        'checkPermissions',
        'requestPermissions',
      ]);
      component['camera'] = cameraSpy;
      photoCroppingPluginSpy = jasmine.createSpyObj('PhotoCroppingPlugin', [
        'cropPhoto',
      ]);
      component['photoCropping'] = photoCroppingPluginSpy;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngAfterViewInit', () => {
    it('should call ngAfterViewInit when imageBase64 has value', () => {
      component.imageBase64 = 'file-upload';
      component.ngAfterViewInit();
      expect(benefitSerivceSpy.appendBase64MetaData).toHaveBeenCalledWith(
        'file-upload'
      );
    });
    it('should call ngAfterViewInit when imageBase64 is undefined', () => {
      component.imageBase64 = undefined;
      component.ngAfterViewInit();
      expect(component.imageBase64).toBeUndefined();
    });
  });

  describe('openFileBrowser', () => {
    it('should create', () => {
      component.isWeb = true;
      component.fileInput = {
        nativeElement: jasmine.createSpyObj('nativeElement', ['click']),
      };
      component.openFileBrowser();
      expect(component.fileInput.nativeElement.click).toHaveBeenCalled();
    });
    it('should create', () => {
      component.isWeb = false;
      const presentActionSheetSpy = spyOn(component, 'presentActionSheet');
      component.openFileBrowser();
      expect(presentActionSheetSpy).toHaveBeenCalled();
    });
  });

  describe('selectFile', () => {
    let event;
    let mockFileReader;
    beforeEach(() => {
      event = {target: {files: ['abc', 'def']}};
      mockFileReader = {
        result: 'data:image/png;base64,"file-upload"',
        readAsDataURL: jasmine.createSpy(),
      };
      spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
      spyOn(component.fileBase64, 'emit');
    });
    it('should call readAsDataURL', () => {
      component.selectFile(event);
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith('abc');
    });
    it('should emit fileBase64', () => {
      benefitSerivceSpy.trimBase64MetaData.and.callFake(
        str => str + 'fileUpload'
      );
      component.selectFile(event);
      mockFileReader.onload();
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith('abc');
      expect(benefitSerivceSpy.trimBase64MetaData).toHaveBeenCalledWith(
        'data:image/png;base64,"file-upload"'
      );
      expect(component.fileBase64.emit).toHaveBeenCalledWith(
        'data:image/png;base64,"file-upload"fileUpload'
      );
    });
  });

  describe('changeCard', () => {
    beforeEach(() => {
      spyOn(component, 'openFileBrowser');
    });
    it('should create', () => {
      component.changeCard();
      expect(component.openFileBrowser).toHaveBeenCalled();
    });
  });
  describe('presentActionSheet', () => {
    let actionSheetSpy;
    let buttonArray;
    beforeEach(() => {
      buttonArray = [
        {
          text: pageContent.actionsheet.fromPhotos,
          handler: jasmine.any(Function),
        },
        {
          text: pageContent.actionsheet.fromCamera,
          handler: jasmine.any(Function),
        },
        {
          text: pageContent.actionsheet.cancel,
          role: 'cancel',
        },
      ];
      actionSheetSpy = jasmine.createSpyObj('ActionSheet', ['present']);
      actionSheetControllerSpy.create.and.returnValue(
        Promise.resolve(actionSheetSpy)
      );
      spyOn(component, 'startLoader');
      spyOn<any>(component, 'load');
    });
    it('should create and present action sheet with photos', async () => {
      await component.presentActionSheet();
      expect(actionSheetControllerSpy.create).toHaveBeenCalledWith({
        buttons: buttonArray,
      });
      const handler = actionSheetControllerSpy.create.calls.all()[0].args[0]
        .buttons[0].handler;
      handler();
      expect(component.startLoader).toHaveBeenCalledWith(upload_from.PHOTOS);
      expect(actionSheetSpy.present).toHaveBeenCalled();
    });

    it('should create and present action sheet with camera', async () => {
      await component.presentActionSheet();
      expect(actionSheetControllerSpy.create).toHaveBeenCalledWith({
        buttons: buttonArray,
      });
      const handler = actionSheetControllerSpy.create.calls.all()[0].args[0]
        .buttons[1].handler;
      handler();
      expect(component.startLoader).toHaveBeenCalledWith(upload_from.CAMERA);
      expect(actionSheetSpy.present).toHaveBeenCalled();
    });
  });

  describe('openSource', () => {
    it('Open Photos for image capture from camera', async () => {
      const image: Photo = {
        base64String:
          'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=',
        dataUrl:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=',
        path: 'path',
        webPath: 'path',
        exif: '',
        format: 'JPEG',
        saved: false,
      };
      cameraSpy.getPhoto.and.returnValue(Promise.resolve(image));
      const img = await component.openSource(upload_from.CAMERA);
      expect(cameraSpy.getPhoto).toHaveBeenCalledWith({
        quality: 90,
        allowEditing: true,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64,
      });
      expect(img).toEqual(image);
    });

    it('Open Photos for image capture from camera for ios', async () => {
      platformSpy.is.and.returnValue(true);
      await component.openSource(upload_from.CAMERA);
      expect(cameraSpy.getPhoto).toHaveBeenCalledWith({
        quality: 90,
        allowEditing: false,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64,
      });
    });

    it('Throw error for camera interuption', async () => {
      cameraSpy.getPhoto.and.returnValue(
        Promise.reject({
          message: 'error',
        })
      );
      const result = await component.openSource(upload_from.PHOTOS);
      expect(cameraSpy.getPhoto).toHaveBeenCalledWith({
        quality: 90,
        allowEditing: true,
        source: CameraSource.Photos,
        resultType: CameraResultType.Base64,
      });
      expect(result).toBeUndefined();
    });
  });

  describe('checkPermissionAndRequest', () => {
    let permission;
    beforeEach(() => {
      permission = {
        photos: 'granted',
        camera: 'prompt',
      };
      cameraSpy.checkPermissions.and.returnValue(Promise.resolve(permission));

      component['checkPermission'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(false));
    });

    it('should return true if checkPermission returns true', async () => {
      component['checkPermission'] = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(true));
      const result = await component['checkPermissionAndRequest'](
        upload_from.PHOTOS
      );
      expect(cameraSpy.checkPermissions).toHaveBeenCalled();
      expect(component['checkPermission']).toHaveBeenCalledWith(
        permission,
        'photos'
      );
      expect(cameraSpy.requestPermissions).not.toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('should return true if permission is not denied and requesting permissions gives the permission', async () => {
      const requestPermission: PermissionStatus = {
        photos: 'granted',
        camera: 'granted',
      };
      cameraSpy.requestPermissions.and.returnValue(
        Promise.resolve(requestPermission)
      );
      let i = 0;
      component['checkPermission'] = jasmine.createSpy().and.callFake(() => {
        i++;
        return i !== 1;
      });
      const result = await component['checkPermissionAndRequest'](
        upload_from.CAMERA
      );
      expect(cameraSpy.requestPermissions).toHaveBeenCalledWith({
        permissions: ['camera'],
      });
      expect(component['checkPermission']).toHaveBeenCalledTimes(2);
      expect(component['checkPermission']).toHaveBeenCalledWith(
        requestPermission,
        'camera'
      );
      expect(result).toBeTrue();
    });

    it('should not request permission if it is already denied', async () => {
      permission.camera = 'denied';
      const result = await component['checkPermissionAndRequest'](
        upload_from.CAMERA
      );
      expect(component['checkPermission']).toHaveBeenCalledTimes(1);
      expect(cameraSpy.requestPermissions).not.toHaveBeenCalled();
      expect(result).toBeFalse();
    });
  });

  describe('checkPermission', () => {
    let permission: PermissionStatus;

    beforeEach(() => {
      permission = {
        photos: 'granted',
        camera: 'prompt',
      };
      component['showModal'] = jasmine.createSpy();
    });

    it('should return true for granted', async () => {
      const result = await component['checkPermission'](permission, 'photos');
      expect(result).toBeTrue();
      expect(component['showModal']).not.toHaveBeenCalled();
    });

    it('should return true for limited', async () => {
      permission.photos = 'limited';
      const result = await component['checkPermission'](permission, 'photos');
      expect(result).toBeTrue();
      expect(component['showModal']).not.toHaveBeenCalled();
    });

    it('should return false for prompt', async () => {
      permission.photos = 'prompt';
      const result = await component['checkPermission'](permission, 'photos');
      expect(result).toBeFalse();
      expect(component['showModal']).not.toHaveBeenCalled();
    });

    it('should show the modal with photo text for denied photo', async () => {
      permission.photos = 'denied';
      const result = await component['checkPermission'](permission, 'photos');
      expect(result).toBeFalse();
      expect(component['showModal']).toHaveBeenCalledWith({
        yesText: 'Okay',
        description:
          'Please enable photo library permission from the device settings of the app to use this feature.',
        header: 'Photo library permission is denied',
      });
    });

    it('should show the alert with camera text for denied camera', async () => {
      permission.camera = 'denied';
      const result = await component['checkPermission'](permission, 'camera');
      expect(result).toBeFalse();
      expect(component['showModal']).toHaveBeenCalledWith({
        yesText: 'Okay',
        description:
          'Please enable camera permission from the device settings of the app to use this feature.',
        header: 'Camera permission is denied',
      });
    });
  });

  describe('startLoader', () => {
    let checkPermissionAndRequestSpy;

    beforeEach(() => {
      checkPermissionAndRequestSpy = jasmine
        .createSpy()
        .and.returnValue(Promise.resolve(true));
      component['checkPermissionAndRequest'] = checkPermissionAndRequestSpy;
    });

    it('should not create the loader if permissions are not granted', async () => {
      checkPermissionAndRequestSpy.and.returnValue(Promise.resolve(false));
      await component.startLoader(upload_from.CAMERA);
      expect(checkPermissionAndRequestSpy).toHaveBeenCalledWith(
        upload_from.CAMERA
      );
    });
    it('should call load function if permissions are granted', async () => {
      const loadSpy = spyOn<any>(component, 'load');
      checkPermissionAndRequestSpy.and.returnValue(Promise.resolve(true));
      await component.startLoader(upload_from.CAMERA);
      expect(loadSpy).toHaveBeenCalledWith(upload_from.CAMERA);
    });
  });
  describe('showModal', () => {
    let modalSpy;

    beforeEach(() => {
      modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
    });

    it('should open modal', async () => {
      const componentProps = {component: 'props'};
      await component['showModal'](componentProps);

      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: CardModalComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: componentProps,
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });
  describe('load', () => {
    let image: Photo;
    beforeEach(() => {
      image = {
        base64String:
          'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=',
        dataUrl:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=',
        path: 'path',
        webPath: 'path',
        exif: '',
        format: 'JPEG',
        saved: false,
      };
      spyOn(component, 'openSource').and.returnValue(Promise.resolve(image));
      spyOn(component.fileBase64, 'emit');
    });

    it('should call opensource with type', async () => {
      component['load'](upload_from.PHOTOS);
      expect(component.openSource).toHaveBeenCalledWith(upload_from.PHOTOS);
    });

    it('should call opensource but not emit fileBase64', async () => {
      cameraSpy.getPhoto.and.returnValue(
        Promise.reject({
          message: 'error',
        })
      );
      component['load'](upload_from.PHOTOS);
      expect(component.fileBase64.emit).not.toHaveBeenCalled();
    });

    it('should crop with the photoCroppingPlugin if its ios and taken with camera', async () => {
      platformSpy.is.and.returnValue(true);
      const img = 'newImg';
      photoCroppingPluginSpy.cropPhoto.and.returnValue(
        Promise.resolve({image: img})
      );
      await component['load'](upload_from.CAMERA);
      expect(platformSpy.is).toHaveBeenCalledWith('ios');
      expect(photoCroppingPluginSpy.cropPhoto).toHaveBeenCalledWith({
        image:
          'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII=',
      });
      expect(component.fileBase64.emit).toHaveBeenCalledWith(img);
    });

    it('should not crop with the photoCroppingPlugin if its not ios', async () => {
      platformSpy.is.and.returnValue(false);
      await component['load'](upload_from.CAMERA);
      expect(photoCroppingPluginSpy.cropPhoto).not.toHaveBeenCalled();
    });

    it('should not crop with the photoCroppingPlugin if it is ios but is not camera', async () => {
      platformSpy.is.and.returnValue(false);
      await component['load'](upload_from.PHOTOS);
      expect(photoCroppingPluginSpy.cropPhoto).not.toHaveBeenCalled();
    });
  });
});
