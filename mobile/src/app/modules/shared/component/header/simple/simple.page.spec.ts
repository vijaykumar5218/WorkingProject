import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SimplePage} from './simple.page';

describe('NavbarComponent', () => {
  let component: SimplePage;

  let fixture: ComponentFixture<SimplePage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SimplePage],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplePage);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
