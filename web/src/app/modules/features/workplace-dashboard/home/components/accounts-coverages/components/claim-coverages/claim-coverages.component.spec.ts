import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ClaimCoveragesComponent} from './claim-coverages.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('ClaimCoveragesComponent', () => {
  let component: ClaimCoveragesComponent;
  let fixture: ComponentFixture<ClaimCoveragesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ClaimCoveragesComponent],
        imports: [RouterTestingModule],
      }).compileComponents();
      fixture = TestBed.createComponent(ClaimCoveragesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
