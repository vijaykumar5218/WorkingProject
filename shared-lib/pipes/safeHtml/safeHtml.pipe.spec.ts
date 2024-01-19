import {SafeHtmlPipe} from './safeHtml.pipe';
import {SafeHtml} from '@angular/platform-browser';

describe('SafeHtmlPipe', () => {
  const mockData: SafeHtml = {
    changingThisBreaksApplicationSecurity:
      "Your Gross yearly Income <span style='color:#d75426 !important;'><strong>($1000.0)</strong></span>, divided by # of weeks in a year <span style='color:#d75426 !important;'><strong>52</strong></span>",
  };
  let domSanitizerSpy;
  beforeEach(() => {
    domSanitizerSpy = jasmine.createSpyObj('domSanitizerSpy', [
      'bypassSecurityTrustHtml',
    ]);
    domSanitizerSpy.bypassSecurityTrustHtml.and.returnValue(mockData);
  });
  it('transform', () => {
    const result = new SafeHtmlPipe(domSanitizerSpy).transform(
      "Your Gross yearly Income <span style='color:#d75426 !important;'><strong>($1000.0)</strong></span>, divided by # of weeks in a year <span style='color:#d75426 !important;'><strong>52</strong></span>"
    );
    expect(domSanitizerSpy.bypassSecurityTrustHtml).toHaveBeenCalledWith(
      "Your Gross yearly Income <span style='color:#d75426 !important;'><strong>($1000.0)</strong></span>, divided by # of weeks in a year <span style='color:#d75426 !important;'><strong>52</strong></span>"
    );
    expect(result).toEqual(mockData);
  });
});
