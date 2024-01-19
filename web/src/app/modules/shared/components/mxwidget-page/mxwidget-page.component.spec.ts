import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {Component, Input} from '@angular/core';
import {WidgetType} from '@shared-lib/services/mx-service/models/widget-type.enum';
import {MXWidgetPageComponent} from './mxwidget-page.component';

@Component({selector: 'app-mx-widget', template: ''})
class MockMXWidgetComponent {
  @Input() tagName: string;
  @Input() widgetType: WidgetType;
  @Input() height: string;
}

describe('MXWidgetPageComponent', () => {
  let component: MXWidgetPageComponent;
  let fixture: ComponentFixture<MXWidgetPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MXWidgetPageComponent, MockMXWidgetComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(MXWidgetPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
