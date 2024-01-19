import {Injectable} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyVoyaService {
  private loadedSubject = new ReplaySubject<void>();
  private iframeLoaded = false;

  constructor(private utilityService: SharedUtilityService) {}

  getLoadedSubject(): Observable<void> {
    return this.loadedSubject;
  }

  setIframeLoaded(iframeLoaded: boolean) {
    this.iframeLoaded = iframeLoaded;
    sessionStorage.setItem('iframeloaded', iframeLoaded.toString());
  }

  getIframeLoaded(): boolean {
    const iframeLoaded = sessionStorage.getItem('iframeloaded');
    return iframeLoaded && iframeLoaded !== 'undefined'
      ? JSON.parse(iframeLoaded)
      : this.iframeLoaded;
  }

  listenForIframeLoad() {
    if (!this.getIframeLoaded()) {
      window.addEventListener('message', message => {
        if (
          message.origin ===
          this.utilityService.getEnvironment().myvoyaBaseUrl.slice(0, -1)
        ) {
          this.setIframeLoaded(true);
          this.loadedSubject.next();
        }
      });
      if (
        this.utilityService.getEnvironment().myvoyaBaseUrl.includes('localhost')
      ) {
        this.setIframeLoaded(true);
        this.loadedSubject.next();
      }
    } else {
      this.loadedSubject.next();
    }
  }
}
