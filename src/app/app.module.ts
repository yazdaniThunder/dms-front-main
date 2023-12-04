import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {AppComponent} from './app.component';
import {ToastrModule} from 'ngx-toastr';
import {HamburgerComponent} from './shared/hamburger-menu/hamburger.component';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {  MatListModule} from '@angular/material';
import { TreeModule } from '@circlon/angular-tree-component';
import {TabViewModule} from 'primeng/tabview';
import {TreeRootComponent} from './data-tree/components/tree-root/tree-root.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from "@angular/material/expansion";
import { InputNumberModule } from "primeng/inputnumber";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import {CoreModule} from './core/core.module';
import {MenuComponent} from './shared/menu/menu.component';
import { PaginatorModule } from "primeng/paginator";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HamburgerComponent,
    TreeRootComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    ToastrModule.forRoot(),
    TreeModule,
    TabViewModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatExpansionModule,
    InputNumberModule,
    MatChipsModule,
    MatAutocompleteModule,
    PaginatorModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
