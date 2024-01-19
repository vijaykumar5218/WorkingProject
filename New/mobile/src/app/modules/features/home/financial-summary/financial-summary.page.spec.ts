import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {HeaderType} from '@shared-lib/constants/headerType.enum';
import {FooterType} from '@shared-lib/modules/footer/constants/footerType.enum';
import {FinancialSummaryPage} from './financial-summary.page';
import * as PageText from './constants/financial-summary-content.json';
import {Component, Input} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MXService} from '@shared-lib/services/mx-service/mx.service';
import {HeaderFooterTypeService} from '@shared-lib/services/header-footer-type/headerFooterType.service';

@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('FinancialSummaryPage', () => {
  const pageText = (PageText as any).default;

  let component: FinancialSummaryPage;
  let fixture: ComponentFixture<FinancialSummaryPage>;
  let headerFooterServiceSpy;
  let mxServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerFooterServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publishType',
      ]);
      mxServiceSpy = jasmine.createSpyObj('MXService', [
        'addMXWindowEventListener',
        'removeMXWindowEventListener',
      ]);

      TestBed.configureTestingModule({
        declarations: [FinancialSummaryPage, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {provide: HeaderFooterTypeService, useValue: headerFooterServiceSpy},
          {provide: MXService, useValue: mxServiceSpy},
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FinancialSummaryPage);
      component = fixture.componentInstance;

      component.contentView = {
        nativeElement: {
          offsetHeight: 500,
        },
      };

      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set height', () => {
      expect(component.height).toEqual('530px');
    });
  });

  describe('ionViewWillEnter', () => {
    it('should set header, footer, and load mx widget', () => {
      component.ionViewWillEnter();

      expect(headerFooterServiceSpy.publishType).toHaveBeenCalledWith(
        {
          type: HeaderType.navbar,
          actionOption: {
            headername: pageText.header,
            btnleft: true,
            buttonLeft: {
              name: pageText.back,
              link: 'home',
            },
          },
        },
        {type: FooterType.none}
      );
    });
  });

  describe('ionViewDidEnter', () => {
    it('should call mxService.addMXWindowEventListener', () => {
      component.ionViewDidEnter();
      expect(mxServiceSpy.addMXWindowEventListener).toHaveBeenCalled();
    });
  });

  describe('ionViewWillLeave', () => {
    it('should call mxService.removeMXWindowEventListener', () => {
      component.ionViewWillLeave();
      expect(mxServiceSpy.removeMXWindowEventListener).toHaveBeenCalled();
    });
  });
});
