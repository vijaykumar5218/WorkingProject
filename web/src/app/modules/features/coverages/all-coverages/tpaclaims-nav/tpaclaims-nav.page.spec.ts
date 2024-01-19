import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TPAClaimsNavPage} from './tpaclaims-nav.page';

describe('TPAClaimsNavPage', () => {
  let component: TPAClaimsNavPage;
  let fixture: ComponentFixture<TPAClaimsNavPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TPAClaimsNavPage],
        imports: [RouterTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(TPAClaimsNavPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
