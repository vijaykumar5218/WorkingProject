import {Component, Input} from '@angular/core';
import {StepContentElement} from '@shared-lib/services/journey/models/journey.model';
import {DescString} from '@shared-lib/services/journey/models/descString.model';
import {Subscription} from 'rxjs';
import {JourneyService} from '@shared-lib/services/journey/journey.service';
import {JourneyUtilityService} from '@shared-lib/services/journey/journeyUtilityService/journey-utility.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'journeys-steps-step-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
})
export class IntroComponent {
  @Input() element: StepContentElement;
  descStrings: DescString[];

  private webviewCount = 0;
  private videoCount = 0;
  private appLinkCount = 0;
  listDescStrings: DescString[][];
  headerValueSafe: SafeHtml;
  private subscription = new Subscription();

  constructor(
    private journeyService: JourneyService,
    private journeyUtilityService: JourneyUtilityService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.checkAndSetDescStrings();
    if (this.element?.descriptions) {
      this.listDescStrings = [];
      this.element.descriptions.forEach((desc: string) => {
        const descStrings = this.setDescStrings(desc);
        this.listDescStrings.push(descStrings);
      });
    }
    if (this.element.elements) {
      const journeyId = this.journeyService.getCurrentJourney().journeyID;
      this.subscription.add(
        this.journeyService.journeyServiceMap[journeyId].valueChange.subscribe(
          () => {
            this.checkAndSetDescStrings();
            this.processInnerHTMLData(journeyId);
          }
        )
      );
    }
  }

  private checkAndSetDescStrings() {
    if (this.element?.description) {
      this.descStrings = this.setDescStrings(this.element.description);
    }
  }

  private processInnerHTMLData(journeyId: number) {
    this.headerValueSafe = this.sanitizer.bypassSecurityTrustHtml(
      this.journeyUtilityService.processInnerHTMLData(
        this.element.header,
        this.element.elements,
        journeyId
      )
    );
    this.descStrings?.forEach(description => {
      description.textSafe = this.sanitizer.bypassSecurityTrustHtml(
        this.journeyUtilityService.processInnerHTMLData(
          description.text,
          this.element.elements,
          journeyId
        )
      );
    });
  }

  setDescStrings(str: string): DescString[] {
    let descStrings: DescString[];
    if (
      str?.includes('webview{') ||
      str?.includes('video{') ||
      str?.includes('appLink{')
    ) {
      descStrings = [];
      const split = str.split('{');
      const end = split[1].indexOf('}');
      const linkText = split[1].substring(0, end);
      const restOfText =
        split[1].substring(end + 1) + ['', ...split.slice(2)].join('{');
      if (split[0].substring(split[0].length - 7) === 'webview') {
        const text = split[0].substring(0, split[0].length - 7);
        descStrings.push({text: text});
        descStrings.push({
          text: linkText,
          link: this.element.webviewLinks[this.webviewCount],
          header: this.element.webviewHeaders
            ? this.element.webviewHeaders[this.webviewCount]
            : '',
          id: 'journeyWebviewLink' + this.webviewCount + this.element.idSuffix,
          toolbar: this.getToolbar(),
        });
        this.webviewCount++;
      } else if (split[0].substring(split[0].length - 5) === 'video') {
        const text = split[0].substring(0, split[0].length - 5);
        descStrings.push({text: text});
        descStrings.push({
          text: linkText,
          videoUrl: this.element.videoUrls[this.videoCount],
          playerId: this.element.playerIds[this.videoCount],
          id: 'journeyVideoLink' + this.videoCount + this.element.idSuffix,
        });
        this.videoCount++;
      } else {
        const text = split[0].substring(0, split[0].length - 7);
        descStrings.push({text: text});
        descStrings.push({
          text: linkText,
          appLink: this.element.appLinks[this.appLinkCount],
          id: 'journeyAppLink' + this.appLinkCount + this.element.idSuffix,
        });
        this.appLinkCount++;
      }
      if (restOfText) {
        const strings = this.setDescStrings(restOfText);
        descStrings = descStrings.concat(strings);
      }
    } else {
      descStrings = [{text: str}];
    }
    return descStrings;
  }

  private getToolbar(): boolean {
    return this.element.webviewToolbars
      ? this.element.webviewToolbars[this.webviewCount]
      : false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
