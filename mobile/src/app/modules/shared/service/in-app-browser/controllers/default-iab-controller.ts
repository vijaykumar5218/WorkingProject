import {
  InAppBrowserEvent,
  InAppBrowserObject,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser';
import {LoadingController} from '@ionic/angular';
import {IABMessage} from '../constants/message.enum';
import {IABController} from './iab-controller';
import * as iabText from '../constants/inAppBrowser.json';

export class DefaultIABController implements IABController {
  iabText: Record<string, string> = iabText;
  browser: InAppBrowserObject;
  cordovaInApp: any;
  loadingController: LoadingController;
  firstLoad = true;
  showLoader = true;
  browserOptions: InAppBrowserOptions = {
    allowInlineMediaPlayback: 'yes',
    beforeload: undefined,
    clearcache: 'yes',
    cleardata: 'no',
    clearsessioncache: 'yes',
    closebuttoncaption: '',
    closebuttoncolor: '',
    disallowoverscroll: 'no',
    enableViewportScale: 'yes',
    footer: 'no',
    footercolor: '',
    fullscreen: 'no',
    hardwareback: 'yes',
    hidden: 'yes',
    hidenavigationbuttons: 'no',
    hidespinner: 'no',
    hideurlbar: 'yes',
    keyboardDisplayRequiresUserAction: 'yes',
    lefttoright: 'no',
    location: 'no',
    mediaPlaybackRequiresUserAction: 'yes',
    navigationbuttoncolor: '',
    presentationstyle: 'fullscreen',
    shouldPauseOnSuspend: 'no',
    suppressesIncrementalRendering: 'yes', //maybe try yes
    toolbar: 'no',
    toolbarcolor: undefined,
    toolbarposition: undefined,
    toolbartranslucent: undefined,
    transitionstyle: 'coververtical',
    useWideViewPort: 'no',
    usewkwebview: 'yes',
    zoom: 'no',
  };

  private loadingPromise: Promise<void>;

  constructor() {
    this.loadingController = new LoadingController();
  }

  async loadStartCallback() {
    //Show loading spinner
    if (this.firstLoad && this.showLoader) {
      this.firstLoad = false;
      this.loadingPromise = this.presentAlert();
      await this.loadingPromise;
    }
  }

  private async presentAlert(): Promise<void> {
    const loading = await this.loadingController.create({
      translucent: true,
    });
    await loading.present();
  }

  async loadStopCallback() {
    //Dismiss the loader
    if (this.loadingPromise) {
      await this.loadingPromise;
      this.loadingController.dismiss();
      this.loadingPromise = undefined;
    }

    //Finally shows browser after the entire page has been loaded and altered
    this.browser.show();
  }

  messageCallback(event: InAppBrowserEvent) {
    if (event.data.message === IABMessage.externalLink) {
      window.open(event.data.url);
    }
    if (event.data.message === IABMessage.close) {
      this.browser.close();
    }
  }

  displayCustomHeader(
    headerText?: string,
    absolutePosition = false,
    useTitle = true
  ) {
    if (!headerText) {
      headerText = this.iabText.voya;
    }
    this.browser.executeScript({
      code: `(function() {
          if(!document.querySelector('.in_app_header')){
            var body = document.querySelector('body');
  
            var title = document.getElementsByTagName('title')[0].innerHTML;
            if(!title || ${useTitle} === false) {
              title = '${headerText}';
            }
    
            var header = document.createElement('div');
            header.classList.add('in_app_header');
    
            var spacer = document.createElement('div');
            spacer.classList.add('header_spacer');
    
            var button = document.createElement('div'); 
            button.setAttribute('id','in_app_close');
            button.innerHTML = '${this.iabText.closeButton}';
            button.classList.add('close_btn');
            button.onclick = function() {
              webkit.messageHandlers.cordova_iab.postMessage(JSON.stringify({message: '${IABMessage.close}'}));
            };
  
            var titleDiv = document.createElement('div');
            titleDiv.innerHTML = title;
            titleDiv.classList.add('title');
  
            var button2 = document.createElement('div'); 
            button2.innerHTML = '${this.iabText.closeButton}';
            button2.classList.add('right_btn');
  
            header.append(button);
            header.append(titleDiv);
            header.append(button2);
            body.prepend(header);
            body.prepend(spacer);
          }
        })()`,
    });

    this.browser.insertCSS({
      code: `.in_app_header {
          position: ${absolutePosition ? 'absolute' : 'fixed'};
          z-index: 999;
          font-size: 18px;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60px;
          color: black;
          background: #ffffff;
          width: 100%;
          box-shadow: 0 3px 4px rgba(57, 63, 72, 0.3);
          white-space: nowrap;
          overflow: hidden;
          font-weight: 600;
          text-overflow: ellipsis;
        }
        .title {
          flex-grow: 999;
          text-align: center;
          max-width: 65%;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .header_spacer {
          position: ${absolutePosition ? 'absolute' : 'relative'};
          top: 0;
          left: 0;
          height: 60px;
          width: 100%;
        }
        .close_btn {
          text-decoration: underline;
          display:flex;
          align-items: center;
          height: 60px;
          font-size: 16px;
          color:rgb(20, 90, 123);
          margin-right: 22px;
          margin-left: 12px;
          font-weight: normal;
        }
        .right_btn {
          text-decoration: underline;
          display:flex;
          align-items: center;
          height: 60px;
          font-size: 16px;
          color:rgb(20, 90, 123);
          margin-right: 22px;
          margin-left: 12px;
          opacity: 0;
        }
        @media (min-width: 768px) {
          nav.navbar.fixed-top {
            top: 60px;
          }
          div.nav-bar.fixed-top {
            top: 127px !important;
          }
        }`,
    });
  }
}
