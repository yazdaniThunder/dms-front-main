import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';




const routes: Routes = [
  {
    path: "",
    redirectTo: "forbidden-page",
  },
  {
    path: "",
    children: [
      {
        path: "forbidden-page",
        component: ForbiddenPageComponent,
        data: {
          title: "ForbiddenPage",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {

}
