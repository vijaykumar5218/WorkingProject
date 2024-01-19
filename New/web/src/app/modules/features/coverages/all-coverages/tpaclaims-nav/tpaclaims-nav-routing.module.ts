import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TPAProvidersComponent} from '@shared-lib/components/coverages/tpaclaims/tpaproviders/tpaproviders.component';
import {TPAStreamConnectPage} from '@shared-lib/components/coverages/tpastream-connect/tpastream-connect.page';
import {TPAClaimsNavPage} from './tpaclaims-nav.page';

const routes: Routes = [
  {
    path: '',
    component: TPAClaimsNavPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import(
            '@shared-lib/components/coverages/tpaclaims/tpaclaims.component.module'
          ).then(m => m.TPAClaimsComponentModule),
      },
      {
        path: 'providers',
        component: TPAProvidersComponent,
      },
      {
        path: 'connect',
        component: TPAStreamConnectPage,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TPAClaimsNavPageRoutingModule {}
