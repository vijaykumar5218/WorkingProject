import {DisplayName} from './models/edit-display-name.model';
import {RouterTestingModule} from '@angular/router/testing';
import {BaseService} from '@shared-lib/services/base/base-factory-provider';
import {TestBed} from '@angular/core/testing';

import {EditDisplayNameService} from './edit-display-name.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';

describe('EditDisplayNameService', () => {
  let service: EditDisplayNameService;
  let utilityServiceSpy;

  const baseServiceSpy = jasmine.createSpyObj('baseServiceSpy', ['post']);

  beforeEach(() => {
    utilityServiceSpy = jasmine.createSpyObj('SharedUtilityService', [
      'appendBaseUrlToEndpoints',
    ]);
    utilityServiceSpy.appendBaseUrlToEndpoints.and.callFake(
      endpoints => endpoints
    );
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {provide: BaseService, useValue: baseServiceSpy},
        {provide: SharedUtilityService, useValue: utilityServiceSpy},
      ],
    });
    service = TestBed.inject(EditDisplayNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveDisplayName', () => {
    it('must call save the display name ', () => {
      const displayName: DisplayName = {displayName: 'John'};
      service.saveDisplayName('John');
      expect(baseServiceSpy.post).toHaveBeenCalledWith(
        'myvoya/ws/ers/service/customers/272c2587-6b79-d874-e053-d22aac0a0939/profile/personalInfo',
        displayName
      );
    });
  });
});
