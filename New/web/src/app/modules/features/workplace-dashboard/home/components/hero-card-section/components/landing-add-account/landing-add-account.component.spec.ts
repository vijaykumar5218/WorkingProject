import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {LandingAddAccountComponent} from './landing-add-account.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

describe('LandingAddAccountComponent', () => {
  let component: LandingAddAccountComponent;
  let fixture: ComponentFixture<LandingAddAccountComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LandingAddAccountComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
      }).compileComponents();
      fixture = TestBed.createComponent(LandingAddAccountComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
