import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {FinancialWellnessPage} from './financial-wellness.page';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';

@Component({selector: 'app-mxwidget-page', template: ''})
class MockMXWidgetPageComponent {
  @Input() widgetType: WidgetType;
  @Input() headerName: string;
  @Input() height: string;
  @Input() tagName: string;
  @Input() widgetId: string;
}

describe('FinancialWellnessPage', () => {
  let component: FinancialWellnessPage;
  let fixture: ComponentFixture<FinancialWellnessPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FinancialWellnessPage, MockMXWidgetPageComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(FinancialWellnessPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
