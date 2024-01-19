import {Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {Observable, Subject} from 'rxjs';
import {BackButtonEmitter} from '@ionic/angular/common/providers/platform';

interface ResumeFunction {
  (): Promise<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  public onReady$: Observable<void>;
  private onReady: Subject<void> = new Subject();

  public onResume$: Observable<void>;
  private onResume: Subject<void> = new Subject();

  public onPause$: Observable<void>;
  private onPause: Subject<void> = new Subject();

  private initialResume: ResumeFunction;
  private pauseBackgroundListeners = false;

  constructor(private platform: Platform) {
    this.onReady$ = this.onReady.asObservable();
    this.onResume$ = this.onResume.asObservable();
    this.onPause$ = this.onPause.asObservable();
  }

  initialize(): void {
    this.platform.ready().then(() => {
      this.onReady.next();
    });

    this.platform.resume.subscribe(this.resume.bind(this));
    this.platform.pause.subscribe(this.pause.bind(this));
  }

  async resume() {
    console.log(
      '============ Got On Resume =============',
      this.pauseBackgroundListeners
    );

    if (this.pauseBackgroundListeners) {
      return;
    }

    console.log('============ Got On Resume (After pause check) =============');

    this.pauseBackgroundListeners = true;
    const result = await this.initialResume();
    this.pauseBackgroundListeners = false;

    if (result) {
      console.log('============ Calling other resumes =============');
      this.onResume.next();
    }
  }

  pause() {
    if (this.pauseBackgroundListeners) {
      return;
    }
    this.onPause.next();
  }

  setInitialResume(resume: ResumeFunction) {
    this.initialResume = resume;
  }

  isIos(): boolean {
    return this.platform.is('ios');
  }

  keyboardDidShow(): any {
    return this.platform.keyboardDidShow;
  }

  backButton(): BackButtonEmitter {
    return this.platform.backButton;
  }
}
