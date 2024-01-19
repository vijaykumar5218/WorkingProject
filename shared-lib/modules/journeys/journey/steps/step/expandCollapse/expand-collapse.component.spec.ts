import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ExpandCollapseComponent} from './expand-collapse.component';

describe('ExpandCollapseComponent', () => {
  let component: ExpandCollapseComponent;
  let fixture: ComponentFixture<ExpandCollapseComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ExpandCollapseComponent],
        imports: [IonicModule.forRoot()],
        providers: [],
      }).compileComponents();

      fixture = TestBed.createComponent(ExpandCollapseComponent);
      component = fixture.componentInstance;
      component.element = {};
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the stepContentElements list', () => {
      const options = [
        {
          description: 'desc1',
          descriptions: ['descs1a', 'descs1b'],
          webviewHeader: 'webviewHeader1',
          webviewLinks: ['webviewLinks1a', 'webviewLinks1b', 'webviewLinks1c'],
          webviewHeaders: [
            'webviewHeaders1a',
            'webviewHeaders1b',
            'webviewHeaders1c',
          ],
          webviewToolbars: [false, false, false],
          videoUrl: 'videoUrl1',
          videoUrls: ['videoUrls1a', 'videoUrls1b'],
          idSuffix: 'idSuffix0',
        },
        {
          description: 'desc2',
          descriptions: ['descs2a', 'descs2b'],
          webviewHeader: 'webviewHeader2',
          webviewLinks: ['webviewLinks2a', 'webviewLinks2b', 'webviewLinks2c'],
          webviewHeaders: [
            'webviewHeaders2a',
            'webviewHeaders2b',
            'webviewHeaders2c',
          ],
          webviewToolbars: [true, true, true],
          videoUrl: 'videoUrl2',
          videoUrls: ['videoUrls2a', 'videoUrls2b'],
          idSuffix: 'idSuffix1',
        },
      ];
      component.element.idSuffix = 'idSuffix';
      component.element.options = [
        {...options[0], id: 'option1'},
        {...options[1], id: 'option2'},
      ];
      component.stepContentElements = [];
      component.ngOnInit();
      expect(component.stepContentElements).toEqual(options);
    });
  });
});
