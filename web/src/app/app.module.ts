import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import {CurrencyPipe} from '@angular/common';
import {AngularFireAnalyticsModule} from '@angular/fire/compat/analytics';
import {AngularFireModule} from '@angular/fire/compat';
import {
  BaseService,
  webBaseServiceFactory,
} from '@shared-lib/services/base/base-factory-provider';
import {ErrorService} from '@shared-lib/services/error/error.service';
import {FooterModule} from '@shared-lib/modules/footer/footer.module';
import {AuthGuard} from './modules/shared/guards/auth/auth-guard.service';
import {SessionTimeoutPopupModule} from './modules/shared/components/session-timeout-popup/session-timeout-popup.module';
import {PreviewAnyFile} from '@ionic-native/preview-any-file/ngx';
import {
  COLLEGE_INJECTION_TOKEN,
  HSA_INJECTION_TOKEN,
  UNEXPECTED_INJECTION_TOKEN,
} from '@shared-lib/services/journey/constants/injectionTokens';
import {HSAService} from '@shared-lib/services/journey/hsaService/hsa.service';
import {UnExpectedService} from '@shared-lib/services/journey/unExpectedService/unExpected.service';
import {HttpRequestInterceptor} from './modules/shared/services/http-interceptor/http-interceptor';
import {CollegeService} from '@shared-lib/services/journey/collegeService/college.service';
import {HeaderModule} from './modules/shared/components/header/header.module';
import {InsightsGuard} from '@shared-lib/guards/insights/insight.guard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslationMessageModalModule} from './modules/shared/components/translation-message-modal/translation-message-modal.module';
import {AltAccessModalModule} from './modules/shared/components/alt-access-modal/alt-access-modal.module';
import {SmartBannerModule} from '@shared-lib/components/smart-banner/smart-banner.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FooterModule,
    AngularFireModule.initializeApp(window.environment.firebaseConfig),
    AngularFireAnalyticsModule,
    SessionTimeoutPopupModule,
    TranslationMessageModalModule,
    HeaderModule,
    BrowserAnimationsModule,
    AltAccessModalModule,
    SmartBannerModule,
  ],
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: BaseService,
      useFactory: webBaseServiceFactory,
      deps: [HttpClient, ErrorService],
    },
    {provide: HSA_INJECTION_TOKEN, useExisting: HSAService},
    {provide: UNEXPECTED_INJECTION_TOKEN, useExisting: UnExpectedService},
    {provide: COLLEGE_INJECTION_TOKEN, useExisting: CollegeService},
    CurrencyPipe,
    AuthGuard,
    PreviewAnyFile,
    {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true},
    InsightsGuard,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
