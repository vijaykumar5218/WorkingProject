import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  displayError: BehaviorSubject<boolean | any>;

  constructor() {
    this.displayError = new BehaviorSubject(false);
  }

  setDisplayError(b: boolean): void {
    this.displayError.next(b);
  }

  getDisplayError(): Observable<boolean> {
    return this.displayError.asObservable();
  }
}
