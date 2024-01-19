import {Component, Input} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {NetWorthPage} from './net-worth.page';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';

@Component({selector: 'app-mxwidget-page', template: ''})
class MockMXWidgetPageComponent {
  @Input() widgetType: WidgetType;
  @Input() headerName: string;
  @Input() height: string;
  @Input() tagName: string;
  @Input() widgetId: string;
}

describe('NetWorthPage', () => {
  let component: NetWorthPage;
  let fixture: ComponentFixture<NetWorthPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NetWorthPage, MockMXWidgetPageComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(NetWorthPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
