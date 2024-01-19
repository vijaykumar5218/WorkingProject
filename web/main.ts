import 'voya-design/build/v-logo';
import 'voya-design/build/v-primary-navigation';
import 'voya-design/build/v-primary-navigation-link';
import 'voya-design/build/v-icon';
import 'voya-design/build/v-desktop-navbar-item';
import 'voya-design/build/v-dropdown-item';
import 'voya-design/build/v-navigation-icon';
import 'voya-design/build/v-brand-stripe';
import 'voya-design/build/v-footer';
import 'voya-design/build/v-footer-nav-item';
import 'voya-design/build/v-mobile-navigation-container';
import 'voya-design/build/v-mobile-navigation-topbar';
import 'voya-design/build/v-mobile-navigation-footer';
import 'voya-design/build/v-mobile-breadcrumb';
import 'voya-design/build/v-drilldown-menu';
import 'voya-design/build/v-drilldown-menu-page';
import 'voya-design/build/v-drilldown-menu-button';
import 'voya-design/build/v-drilldown-menu-link';
import 'voya-design/build/v-search-field';
import 'voya-design/build/v-hamburger';
import 'voya-design/build/v-select';
import 'voya-design/build/v-pagination';
import 'voya-design/build/v-modal';
import 'voya-design/build/v-button';
import 'voya-design/build/v-checkbox';
import 'voya-design/build/v-smartbanner';

import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {prodEnvironment} from './environments/environment.prod';
import {accpEnvironment} from './environments/environment.accp';
import {accpEnvironment2} from './environments/environment.accp2';
import {accpEnvironment3} from './environments/environment.accp3';
import {intgEnvironment} from './environments/environment.intg';
import {intgEnvironment2} from './environments/environment.intg2';
import {intgEnvironment3} from './environments/environment.intg3';
import {unitEnvironment} from './environments/environment.unit';
import {unitEnvironment2} from './environments/environment.unit2';
import {unitEnvironment3} from './environments/environment.unit3';
import {localEnvironment} from './environments/environment.local';

let env = prodEnvironment;
const href = window.location.href;
if (window.location.href.includes('intg')) {
  env = intgEnvironment;
  if (href.includes('myvoyage2')) {
    env = intgEnvironment2;
  } else if (href.includes('myvoyage3')) {
    env = intgEnvironment3;
  }
} else if (window.location.href.includes('accp')) {
  env = accpEnvironment;
  if (href.includes('myvoyage2')) {
    env = accpEnvironment2;
  } else if (href.includes('myvoyage3')) {
    env = accpEnvironment3;
  }
} else if (window.location.href.includes('unit')) {
  env = unitEnvironment;
  if (href.includes('myvoyage2')) {
    env = unitEnvironment2;
  } else if (href.includes('myvoyage3')) {
    env = unitEnvironment3;
  }
} else if (window.location.href.includes('localhost')) {
  env = localEnvironment;
}
window.environment = env;

if (env.production) {
  enableProdMode();
}
const appModule = require('./src/app/app.module');
platformBrowserDynamic()
  .bootstrapModule(appModule.AppModule)
  .catch(err => console.log(err));
