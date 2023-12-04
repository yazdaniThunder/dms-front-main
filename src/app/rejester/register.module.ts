import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RegisterRoutingModule} from './register-routing.module';
import { LoginComponent } from './login/login.component';
import {SharedModule} from '../shared/shared.module';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatInputModule,
    FormsModule,
    FlexLayoutModule,


  ]
})
export class RegisterModule { }
