import {NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {RouteReuseStrategy, Router} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {UntypedFormBuilder} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {lightTheme} from 'styles/theme/branding/light-theme';
import {darkTheme} from 'styles/theme/branding/dark-theme';
import {ThemeModule} from 'styles/theme/branding/theme.module';
import {HTTP} from '@ionic-native/http/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {HeaderModule} from './modules/shared/component/header/header.module';
import {FooterModule} from '@shared-lib/modules/footer/footer.module';
import {CurrencyPipe, Location} from '@angular/common';
import {LoadingService} from '../app/modules/shared/service/loading-service/loading.service';
import {AuthenticationService} from './modules/shared/service/authentication/authentication.service';
import {
  BaseService,
  mobileBaseServiceFactory,
} from '@shared-lib/services/base/base-factory-provider';
import {VaultService} from './modules/shared/service/authentication/vault.service';
import {
  COLLEGE_INJECTION_TOKEN,
  HSA_INJECTION_TOKEN,
  UNEXPECTED_INJECTION_TOKEN,
} from '@shared-lib/services/journey/constants/injectionTokens';
import {HSAService} from '@shared-lib/services/journey/hsaService/hsa.service';
import {PreviewAnyFile} from '@ionic-native/preview-any-file/ngx';
import {pageAnimator} from './animations';
import {UnExpectedService} from '@shared-lib/services/journey/unExpectedService/unExpected.service';
import {CollegeService} from '@shared-lib/services/journey/collegeService/college.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const appInitFactory = (
  vaultService: VaultService
): (() => Promise<void>) => async () => await vaultService.initializeVault();

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({navAnimation: pageAnimator}),
    AppRoutingModule,
    ThemeModule.forRoot({
      themes: [lightTheme, darkTheme],
      active: 'dark',
    }),
    HeaderModule,
    FooterModule,
    BrowserAnimationsModule,
  ],
  providers: [
    HttpClientModule,
    HTTP,
    InAppBrowser,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: BaseService,
      useFactory: mobileBaseServiceFactory,
      deps: [HTTP, Router, LoadingService, Location, AuthenticationService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [VaultService, Router],
      multi: true,
    },
    UntypedFormBuilder,
    Title,
    CurrencyPipe,
    {provide: HSA_INJECTION_TOKEN, useExisting: HSAService},
    {provide: UNEXPECTED_INJECTION_TOKEN, useExisting: UnExpectedService},
    {provide: COLLEGE_INJECTION_TOKEN, useExisting: CollegeService},
    PreviewAnyFile,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
