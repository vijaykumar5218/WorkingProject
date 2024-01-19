import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';
import {ClaimsComponent} from './claims.component';
import pageText from '../../constants/mybenefits.json';
describe('ClaimsComponent', () => {
  let component: ClaimsComponent;
  let fixture: ComponentFixture<ClaimsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ClaimsComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ClaimsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should assign the json data to the variable', () => {
    it('header, message and claimLinks variable data from json text', () => {
      expect(component.header).toEqual(pageText.claims.header);
      expect(component.msg).toEqual(pageText.claims.message);
      expect(component.claimLinks).toEqual(pageText.claims.claimLinks);
    });
  });
});
