import {Component, Input, OnInit} from '@angular/core';
import {SharedUtilityService} from '@shared-lib/services/utility/utility.service';
import {
  FootNote,
  PlanSumGroup,
} from '../../../../../services/benefits/models/benefits.model';

@Component({
  selector: 'app-cov-extra-details',
  templateUrl: './cov-extra-details.component.html',
  styleUrls: ['./cov-extra-details.component.scss'],
})
export class CovExtraDetailsComponent implements OnInit {
  @Input() planSummaryGroup: PlanSumGroup;
  @Input() notes: FootNote[];
  currentNotes: FootNote[] = [];
  expanded = true;
  isWeb = false;

  constructor(private utilityService: SharedUtilityService) {}

  ngOnInit() {
    this.isWeb = this.utilityService.getIsWeb();
    this.setupNotes();
  }

  setupNotes() {
    const noteIds: string[] = [];
    this.planSummaryGroup.items.forEach(item => {
      item.footnotes.forEach(note => {
        noteIds.push(note);
      });
    });

    noteIds.forEach(noteId => {
      const note = this.notes.find(x => x.name === noteId);
      this.currentNotes.push(note);
    });
  }

  toggle() {
    this.expanded = !this.expanded;
  }
}
