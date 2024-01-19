import {SafeHtml} from '@angular/platform-browser';

export interface DescString {
  text: string;
  link?: string;
  header?: string;
  videoUrl?: string;
  playerId?: string;
  id?: string;
  toolbar?: boolean;
  appLink?: string;
  textSafe?: SafeHtml;
}
