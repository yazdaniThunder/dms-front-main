import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeDragDropService } from "primeng/api";
import { BadgeUpdateInterceptor } from "../shared/interceptors/BadgeUpdateInterceptor";
import { ErrorInterceptor } from "../shared/interceptors/ErrorInterceptor";
import { JwtInterceptor } from "../shared/interceptors/JwtInterceptor";
import { LoadingInterceptor } from "../shared/interceptors/loading.interceptor";
import { TokenInterceptor } from "../shared/interceptors/tokenInterceptor";
import { AuthGuard } from "../shared/services/auth-guard.service";
import { AuthService } from "../shared/services/auth.service";
import { HeaderService } from "../shared/services/header.service";
import { SpinnerComponent } from "../shared/spinner/spinner.component";
import { FooterComponent } from "./footer/footer.component";

@NgModule({
  declarations: [FooterComponent, SpinnerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [FooterComponent, SpinnerComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    HeaderService,
    AuthService,
    AuthGuard,
    TreeDragDropService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BadgeUpdateInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
