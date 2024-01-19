import {Component, Input} from '@angular/core';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {JourneyContent} from '@shared-lib/services/journey/models/journeyContent.model';
import * as journeyContent from '@shared-lib/services/journey/constants/journey-content.json';

@Component({
  selector: 'journeys-steps-step-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss'],
})
export class VideoModalComponent {
  content: JourneyContent = journeyContent;
  @Input() videoUrl: string;
  @Input() playerId: string;

  url: SafeUrl;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.videoUrl +
        '&flashvars[mobileAutoPlay]=true&flashvars[autoPlay]=true&flashvars[EmbedPlayer.WebKitPlaysInline]=true&flashVars[EmbedPlayer.EnableFullscreen]=false'
    );
  }
}
