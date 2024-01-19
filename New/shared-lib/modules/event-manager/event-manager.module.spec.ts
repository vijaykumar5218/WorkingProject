import {async, TestBed} from '@angular/core/testing';
import {EventManagerModule} from './event-manager.module';

describe('EventManagerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EventManagerModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EventManagerModule).toBeDefined();
  });
});
