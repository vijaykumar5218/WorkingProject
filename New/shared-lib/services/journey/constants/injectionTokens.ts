import {InjectionToken} from '@angular/core';
import {HSAService} from '../hsaService/hsa.service';
import {UnExpectedService} from '../unExpectedService/unExpected.service';
import {CollegeService} from '../collegeService/college.service';

export const HSA_INJECTION_TOKEN = new InjectionToken<HSAService>('HSAService');
export const UNEXPECTED_INJECTION_TOKEN = new InjectionToken<UnExpectedService>(
  'UnExpectedService'
);
export const COLLEGE_INJECTION_TOKEN = new InjectionToken<CollegeService>(
  'CollegeService'
);
export const injectionTokenMap: {
  HSAService: InjectionToken<HSAService>;
  UnExpectedService: InjectionToken<UnExpectedService>;
  CollegeService: InjectionToken<CollegeService>;
} = {
  HSAService: HSA_INJECTION_TOKEN,
  UnExpectedService: UNEXPECTED_INJECTION_TOKEN,
  CollegeService: COLLEGE_INJECTION_TOKEN,
};
