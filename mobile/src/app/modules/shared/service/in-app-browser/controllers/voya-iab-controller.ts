import {IABMessage} from '../constants/message.enum';
import {DefaultIABController} from './default-iab-controller';

export class VoyaIABController extends DefaultIABController {
  headerText: string;

  clearHeaderAndFooter() {
    //Removes header
    this.browser.executeScript({
      code: `(function() { 
            if(document.getElementsByTagName('header').length > 0) {
              document.getElementsByTagName('header')[0].remove();
            }
            })()`,
    });

    //Remove Footer
    this.browser.executeScript({
      code: `(function() { 
            if(document.getElementsByTagName('footer').length > 0) {
              document.getElementsByTagName('footer')[0].remove();
            }
            })()`,
    });
  }

  async loadStopCallback() {
    super.loadStopCallback();

    this.fixLinks();

    //Removes the current header and footer
    setTimeout(() => {
      this.clearHeaderAndFooter();
    }, 250);

    //Display custom header
    this.displayCustomHeader(this.headerText);
  }

  fixLinks() {
    this.browser.executeScript({
      code: `
        (function() {
            for(let link of document.getElementsByTagName("a")) {
              if(link.href!='javascript:void(0);') {
                link.onclick=function(event) {
                  event.preventDefault();
                  event.stopPropagation();
                  webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({message: "${IABMessage.externalLink}", url: link.href}));
                };
              }
            }
        })();
        `,
    });
  }
}
