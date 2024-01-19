import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FooterComponentDesktop} from './footer.component';
import {of} from 'rxjs';
import {AccessService} from '@shared-lib/services/access/access.service';
import {IonicModule, ModalController} from '@ionic/angular';
import {LanguageDisclamerModalComponent} from '../language-disclaimer-modal/language-disclaimer-modal.component';

describe('FooterComponent', () => {
  let component: FooterComponentDesktop;
  let fixture: ComponentFixture<FooterComponentDesktop>;
  let accessServiceSpy;
  let modalControllerSpy;

  beforeEach(
    waitForAsync(() => {
      accessServiceSpy = jasmine.createSpyObj('AccessService', [
        'isMyWorkplaceDashboardEnabled',
      ]);
      modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);
      TestBed.configureTestingModule({
        declarations: [FooterComponentDesktop],
        providers: [
          {provide: AccessService, useValue: accessServiceSpy},
          {provide: ModalController, useValue: modalControllerSpy},
        ],
        imports: [IonicModule.forRoot()],
      }).compileComponents();
      fixture = TestBed.createComponent(FooterComponentDesktop);
      component = fixture.componentInstance;
      component.isReady = true;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set workplaceEnabled$', () => {
      component.workplaceEnabled$ = undefined;
      const obs = of(false);
      accessServiceSpy.isMyWorkplaceDashboardEnabled.and.returnValue(obs);
      component.ngOnInit();
      expect(accessServiceSpy.isMyWorkplaceDashboardEnabled).toHaveBeenCalled();
      expect(component.workplaceEnabled$).toEqual(obs);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should set isReady to true', () => {
      component.isReady = false;
      component.ngAfterViewInit();
      expect(component.isReady).toBeTrue();
    });
  });
  describe('handleSpanishModalEvent', () => {
    it('should call auth service logout', async () => {
      const modalSpy = jasmine.createSpyObj('Modal', ['present']);
      modalControllerSpy.create.and.returnValue(Promise.resolve(modalSpy));
      const e = {
        detail: {
          description: '',
          buttonText: '',
        },
      } as CustomEvent;
      await component.handleSpanishModalEvent(e);
      expect(modalControllerSpy.create).toHaveBeenCalledWith({
        component: LanguageDisclamerModalComponent,
        cssClass: 'modal-not-fullscreen',
        componentProps: {
          message: e.detail.description,
          buttonText: e.detail.buttonText,
        },
        backdropDismiss: false,
      });
    });
  });
});
