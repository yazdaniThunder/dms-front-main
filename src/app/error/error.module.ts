import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {SharedModule} from '../shared/shared.module';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ErrorRoutingModule } from './error-routing.module';
import { ForbiddenPageComponent } from './forbidden-page/forbidden-page.component';








@NgModule({
  declarations: [ForbiddenPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MatInputModule,
    FormsModule,
    FlexLayoutModule,
    ErrorRoutingModule,
  ],
})
export class ErrorModule {}
