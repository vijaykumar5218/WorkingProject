import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BeforeStartingModalContent} from '@shared-lib/services/benefits/models/benefits.model';
import {Router} from '@angular/router';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {OpenSavviService} from '@shared-lib/services/benefits/open-savvi/open-savvi.service';

@Component({
  selector: 'benefits-selection-modal-before-starting',
  templateUrl: './before-starting.component.html',
  styleUrls: ['./before-starting.component.scss'],
})
export class BeforeStartingComponent {
  @Input() modalContent: BeforeStartingModalContent;
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private router: Router,
    private utilityService: SharedUtilityService,
    private openSavviService: OpenSavviService
  ) {}

  openSavvi() {
    if (this.utilityService.getIsWeb()) {
      this.router.navigate([
        'savvi/enrollment-guidance',
        {previousUrl: this.router.url},
      ]);
    } else {
      this.openSavviService.openSavvi();
    }

    this.closeModal.emit();
  }
}
