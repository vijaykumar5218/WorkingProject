import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {AdvisorsComponent} from './advisors.component';
import {DomSanitizer} from '@angular/platform-browser';

describe('AdvisorsComponent', () => {
  let component: AdvisorsComponent;
  let fixture: ComponentFixture<AdvisorsComponent>;
  let sanitizerSpy;
  beforeEach(
    waitForAsync(() => {
      sanitizerSpy = jasmine.createSpyObj('DomSanitizer', [
        'bypassSecurityTrustResourceUrl',
      ]);
      TestBed.configureTestingModule({
        declarations: [AdvisorsComponent],
        imports: [IonicModule.forRoot()],
        providers: [{proivde: DomSanitizer, useValue: sanitizerSpy}],
      }).compileComponents();

      fixture = TestBed.createComponent(AdvisorsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openTargetLink', () => {
    it('should call openTargetLink and open imageTargetUrl in same window', async () => {
      spyOn(window, 'open');
      const offerCodeWithFE = {
        title: 'Get Advice',
        offerCode: 'MANACCT',
        messageType: 'MESSAGE',
        targetUrl:
          'https%3A%2F%2Flogin.unit.voya.com%2Fsaml%2Fsps%2Fsaml-idp-login%2Fsaml20%2Flogininitial%3FPartnerId%3Dhttps%3A%2F%2Fmy3.unit.voya.com%2Fmga%2Fsps%2Fsaml-sp-my-local%2Fsaml20%26access_token%3D%5Bexchanged_access_token%5D%26Target=https%3A%2F%2Fmy3.unit.voya.com%2Fvoyasso%2FmobileSignOn%3Fdomain%3Dvoyaretirement.intg.voya.com%26target%3D/epweb/pweblink.do?s=GmS2ZaJxpCvCKkaAh0dJ7g11.i9291&domain=voyaretirement.intg.voya.com&cl=INGWIN&act_type=P&page=advice&pageId=ACCT_GET_ADVICE&plan=814059&d=ffc90edb4c98789a31ec6c0f1eac4b2507195f63',
        imageTargetUrl:
          'https://my3.intg.voya.com/myvoya/link?type=fe&token=urlResourceType%3DFEISSOIFRAMELINK%26s%3DaQ7CVzwCJZzyMMiyCcVHAA11.i9290%26clientId%3DROLLIN%26vendorId%3DFEI%26domain%3Drollins.intg.voya.com%26act%3Dcallfei%26pagecode%3Dhomealt%26treatment%3Dtile%26service%3Dimageserver%26d%3D37958bb7618acba48f7ad94878fab524b30ecdf6',
        investmentLink:
          'https://my3.intg.voya.com/eicc/servlet/MessageEventTrackingServlet?summaryId=041848716814059MANACCT&loginDateTime=10%2F12%2F2023+15%3A16%3A42&sessionId=GmS2ZaJxpCvCKkaAh0dJ7g11.i9291&msgAction=Yes&messageId=AC.84&msgSource=ACCORDION&targetURL=https%3A%2F%2F%3Cclient+domain%3E%2Fepweb%2Fpweblink.do%3Fpage%3Dadvice%26plan%3D814059%26s%3D%3CSSO+Session+ID%3E%26domain%3D%3CClient+domain%3E%26act_type%3D%26pageId%3DACCT_GET_ADVICE%26d%3D%3Cdigital+sig%3E&d=e0159ccc913fc1e5343a850890fa9bfea33c6219',
        clientId: 'INGWIN',
        messages: 'The right advice can make all the difference. MANACCTIPS/FE',
        linkName: 'Learn More',
      };
      await component.openTargetLink(offerCodeWithFE.imageTargetUrl);
      expect(window.open).toHaveBeenCalledWith(
        offerCodeWithFE.imageTargetUrl,
        '_self'
      );
    });
  });
});
