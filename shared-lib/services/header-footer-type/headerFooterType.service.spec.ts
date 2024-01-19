import {TestBed, waitForAsync} from '@angular/core/testing';
import {HeaderFooterTypeService} from './headerFooterType.service';
import {HeaderType} from '../../constants/headerType.enum';
import {HeaderTypeService} from '../header-type/header-type.service';
import {FooterTypeService} from '@shared-lib/modules/footer/services/footer-type/footer-type.service';
import {FooterType} from '../../modules/footer/constants/footerType.enum';

describe('HeaderFooterTypeService', () => {
  let service: HeaderFooterTypeService;
  let headerTypeServiceSpy;
  let footerTypeServiceSpy;

  beforeEach(
    waitForAsync(() => {
      headerTypeServiceSpy = jasmine.createSpyObj('HeaderTypeService', [
        'publish',
      ]);
      footerTypeServiceSpy = jasmine.createSpyObj('FooterTypeService', [
        'publish',
      ]);
      TestBed.configureTestingModule({
        imports: [],
        providers: [
          {provide: HeaderTypeService, useValue: headerTypeServiceSpy},
          {provide: FooterTypeService, useValue: footerTypeServiceSpy},
        ],
      });
      service = TestBed.inject(HeaderFooterTypeService);
    })
  );

  describe('publishType', () => {
    it('should publish header and footer type', () => {
      service[
        'headerInfoPublisher'
      ] = jasmine.createSpyObj('headerInfoPublisher', ['publish']);
      const headerInfo = {type: HeaderType.authorized};
      const footerInfo = {type: FooterType.none};
      service.publishType(headerInfo, footerInfo);
      expect(headerTypeServiceSpy.publish).toHaveBeenCalledWith(headerInfo);
      expect(footerTypeServiceSpy.publish).toHaveBeenCalledWith(footerInfo);
    });
  });
});
