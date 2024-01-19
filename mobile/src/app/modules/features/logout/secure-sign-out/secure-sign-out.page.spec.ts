import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';
import {SecureSignOutPage} from './secure-sign-out.page';

describe('SecureSignOutPage', () => {
  let component: SecureSignOutPage;
  let fixture: ComponentFixture<SecureSignOutPage>;
  let headerFooterTypeServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerFooterTypeServiceSpy = jasmine.createSpyObj(
        'HeaderFooterTypeService',
        ['publishType']
      );

      TestBed.configureTestingModule({
        declarations: [SecureSignOutPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {
            provide: HeaderFooterTypeService,
            useValue: headerFooterTypeServiceSpy,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SecureSignOutPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should remove header and footer', () => {
      expect(headerFooterTypeServiceSpy.publishType).toHaveBeenCalledWith(
        {type: HeaderType.none},
        {type: FooterType.none}
      );
    });
  });
});
