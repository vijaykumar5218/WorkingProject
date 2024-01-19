import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TPAClaimsComponent} from '@shared-lib/components/coverages/tpaclaims/tpaclaims.component';
import {TPAProvidersComponent} from './tpaproviders/tpaproviders.component';

const routes: Routes = [
  {
    path: '',
    component: TPAClaimsComponent,
    children: [
      {
        path: 'tpaproviders',
        component: TPAProvidersComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TPAClaimsComponentRoutingModule {}
