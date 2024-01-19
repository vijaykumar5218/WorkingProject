import {Category} from './models/help.model';
import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {SharedUtilityService} from '../utility/utility.service';

@Injectable({
  providedIn: 'root',
})
export class HelpService {
  helpContent: Category;
  private focusedOnRouterOutlet: ReplaySubject<boolean>;

  constructor(private sharedUtilityService: SharedUtilityService) {
    this.focusedOnRouterOutlet = new ReplaySubject(1);
  }

  setCategoryData(content: Category): void {
    this.helpContent = content;
  }

  getCategoryData(): Category {
    return this.helpContent;
  }

  backToFaq() {
    this.sharedUtilityService.backToPrevious();
    this.focusedOnRouterOutlet.next(true);
  }

  navigateToHelpContent(url: string) {
    this.sharedUtilityService.navigateByUrl(url);
    this.focusedOnRouterOutlet.next(true);
  }

  isfocusedOnRouterOutlet(): Observable<boolean> {
    return this.focusedOnRouterOutlet;
  }
}
