import {NgModule} from '@angular/core';

import {PersianDate} from './pipes/persian-date.pipe';
import {SafeHtmlPipe} from './pipes/safe-html-pipe';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {ToastrModule} from 'ngx-toastr';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './components/header/header.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { CarouselComponent } from './components/carousel/carousel.component';
import {NgPersianDatepickerModule} from 'ng-persian-datepicker';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {PersianDatePickerComponent} from './components/persian-date-picker/persian-date-picker.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import {SidebarModule} from 'primeng/sidebar';
import {PanelMenuModule} from 'primeng/panelmenu';
import {TreeModule} from 'primeng/tree';
import {ClickOutsideModule} from 'ng-click-outside';
import {FileUploadModule} from 'primeng/fileupload';
import {CheckboxModule} from 'primeng/checkbox';
import { UploaderComponent } from './components/uploader/uploader.component';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {SelectButtonModule} from 'primeng/selectbutton';
import {CheckCharValidPipe} from './pipes/check-char-valid-pipe';
import {AccordionModule} from 'primeng/accordion';
import {MultiSelectModule} from 'primeng/multiselect';
import {RequiredRolesDirective} from './directives/required-roles.directive';
import { SeparatorDirective } from './directives/separator.directive';
import { ToggleButtonModule } from "primeng/togglebutton";
import { ProfileUserModalComponent } from './components/profile-user-modal/profile-user-modal.component';
import { MatCardModule } from "@angular/material/card";
import { NumericInputDirective } from './directives/numericInput.directive';
import { MatBadgeModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import {AutoFocusDirective} from './directives/auto-focus.directive';
import { OtpInputComponent } from './otp-input/otp-input.component';








@NgModule({
  exports: [
    SafeHtmlPipe,
    PersianDate,
    AutoFocusDirective,
    RequiredRolesDirective,
    PersianDatePickerComponent,
    HeaderComponent,
    SelectButtonModule,
    MultiSelectModule,
    DropdownModule,
    TreeModule,
    ToastModule,
    CheckCharValidPipe,
    DialogModule,
    PanelMenuModule,
    SidebarModule,
    ToggleButtonModule,
    CarouselComponent,
    AccordionModule,
    UploaderComponent,
    SeparatorDirective,
    MatCardModule,
    NumericInputDirective,
    MatProgressSpinnerModule,
    OtpInputComponent,
  ],
  entryComponents: [],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MultiSelectModule,
    ToastrModule,
    ToastModule,
    SelectButtonModule,
    NgbModule,
    ClickOutsideModule,
    AccordionModule,
    TableModule,
    FileUploadModule,
    CheckboxModule,
    FlexLayoutModule,
    BsDatepickerModule,
    NgPersianDatepickerModule,
    ToggleButtonModule,
    SidebarModule,
    PanelMenuModule,
    DropdownModule,
    DialogModule,
    TreeModule,
    NgSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatBadgeModule,
  ],
  declarations: [
    SafeHtmlPipe,
    PersianDate,
    CheckCharValidPipe,
    PersianDatePickerComponent,
    HeaderComponent,
    AutoFocusDirective,
    CarouselComponent,
    RequiredRolesDirective,
    UploaderComponent,
    SeparatorDirective,
    ProfileUserModalComponent,
    NumericInputDirective,
    OtpInputComponent,
  ],
  providers: [MessageService],
})
export class SharedModule {}
