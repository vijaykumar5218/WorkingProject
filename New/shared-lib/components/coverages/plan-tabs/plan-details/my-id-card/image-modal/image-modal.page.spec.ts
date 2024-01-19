import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule, ModalController} from '@ionic/angular';
import {ImageModal} from './image-modal.page';
import {SwiperModule} from 'swiper/angular';

describe('ImageModal', () => {
  let component: ImageModal;
  let modalControllerSpy;
  let fixture: ComponentFixture<ImageModal>;

  beforeEach(async () => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    TestBed.configureTestingModule({
      declarations: [ImageModal],
      imports: [IonicModule.forRoot(), SwiperModule],
      providers: [{provide: ModalController, useValue: modalControllerSpy}],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid image source', () => {
    const testImageSrc = 'assets/fw-images/hands.png';
    component.img = testImageSrc;
    fixture.detectChanges();

    const imgElement: HTMLImageElement = fixture.nativeElement.querySelector(
      'img'
    );
    expect(imgElement).toBeTruthy();
    expect(imgElement.src).toEqual(window.location.origin + '/' + testImageSrc);
  });

  describe('close', () => {
    it('should dismiss the modal when close method is called', () => {
      component.close();
      expect(modalControllerSpy.dismiss).toHaveBeenCalled();
    });
  });
});
