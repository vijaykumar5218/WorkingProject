import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {HeaderType} from '../../../constants/headerType.enum';
import {HeaderFooterTypeService} from '../../../services/header-footer-type/headerFooterType.service';
import {ClaimsComponent} from './claims.component';
import claimsContent from './constants/claimsContent.json';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';

describe('ClaimsComponent', () => {
  let component: ClaimsComponent;
  let fixture: ComponentFixture<ClaimsComponent>;
  let headerFooterTypeServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerFooterTypeServiceSpy = jasmine.createSpyObj(
        'HeaderFooterTypeService',
        ['publishType']
      );
      TestBed.configureTestingModule({
        declarations: [ClaimsComponent],
        imports: [IonicModule.forRoot(), RouterModule.forRoot([])],
        providers: [
          {
            provide: HeaderFooterTypeService,
            useValue: headerFooterTypeServiceSpy,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ClaimsComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it('should publish the header and footer type', () => {
      component.ionViewWillEnter();
      expect(headerFooterTypeServiceSpy.publishType).toHaveBeenCalledWith(
        {type: HeaderType.none},
        {type: FooterType.none}
      );
    });
  });

  describe('updateHeader', () => {
    it('should set the header to expensesHeader if consent is true', () => {
      component.header = undefined;
      component.updateHeader(true);
      expect(component.header).toEqual(claimsContent.expensesHeader);
    });

    it('should set the header to authorizationHeader if consent is false', () => {
      component.header = undefined;
      component.updateHeader(false);
      expect(component.header).toEqual(claimsContent.authorizationHeader);
    });
  });
});
