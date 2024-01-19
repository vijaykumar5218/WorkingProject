import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ContentLinkModalComponent} from './contentLinkModal.component';

describe('ContentLinkModalComponent', () => {
  let component: ContentLinkModalComponent;
  let fixture: ComponentFixture<ContentLinkModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ContentLinkModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(ContentLinkModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create from content link modal', () => {
    expect(component).toBeTruthy();
  });
});
