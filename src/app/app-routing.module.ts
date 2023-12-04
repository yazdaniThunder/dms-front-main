import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "register/login",
    pathMatch: "full",
  },
  {
    path: "register",
    loadChildren: () =>
      import("./rejester/register.module").then((m) => m.RegisterModule),
  },
  {
    path: "main",
    loadChildren: () => import("./main/main.module").then((m) => m.MainModule),
  },
  {
    path: "error",
    loadChildren: () =>
      import("./error/error.module").then((m) => m.ErrorModule),
  },
  {
    path: "**",
    redirectTo: "error",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
