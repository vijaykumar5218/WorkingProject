import {Status} from '@shared-lib/constants/status.enum';
import {Journey} from '@shared-lib/services/journey/models/journey.model';

export interface RecommendedJourney extends Journey {
  status: Status;
  buttonText: string;
}
