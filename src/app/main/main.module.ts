import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { MainRoutingModule } from "./main-routing.module";
import { SharedModule } from "../shared/shared.module";
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatListModule,
} from "@angular/material";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { FlexModule } from "@angular/flex-layout";
import { MatDialogModule } from "@angular/material/dialog";
import { TreeModule } from "primeng/tree";
import { ManageDocumentComponent } from "./brnaches/manage-document/manage-document.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { TableModule } from "primeng/table";
import { AddPackageComponent } from "./brnaches/add-package/add-package.component";
import { ConfirmPackageComponent } from "./brnaches/confirm-package/confirm-package.component";
import { ManageContradictionComponent } from "./documents/manage-contradiction/manage-contradiction.component";
import { ManageContradictionInBranchComponent } from "./brnaches/manage-contradiction-in-branch/manage-contradiction-in-branch.component";
import { ManageScanningComponent } from "./documents/manage-scanning/manage-scanning.component";
import { TreeDirectoryComponent } from "../data-tree/components/tree-directory/tree-directory.component";
import { MatSelectModule } from "@angular/material/select";
import { TabViewModule } from "primeng/tabview";
import { ButtonModule } from "primeng/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FilePropertiesComponent } from "../data-tree/components/file-properties/file-properties.component";
import { NoteComponent } from "../data-tree/components/note/note.component";
import { GroupModificationComponent } from "../data-tree/components/group-modification/group-modification.component";
import { DataModificationComponent } from "../data-tree/components/data-modification/data-modification.component";
import { FileShowingComponent } from "../data-tree/components/file-showing/file-showing.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { EditorModule, TINYMCE_SCRIPT_SRC } from "@tinymce/tinymce-angular";
import { TreeDocPagesComponent } from "../data-tree/components/tree-doc-pages/tree-doc-pages.component";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { InProgressComponent } from "./in-progress/in-progress.component";
import { BookmarkDirectoryComponent } from "../data-tree/components/bookmark-directory/bookmark-directory.component";
import { VersionHistoryComponent } from "../data-tree/components/version-history/version-history.component";
import { SearchDocumentComponent } from "./brnaches/search-document/search-document.component";
import { EditPackageComponent } from "./brnaches/edit-package/edit-package.component";
import { ShowPackageComponent } from "./brnaches/show-package/show-package.component";
import { MatIconModule } from "@angular/material/icon";
import { FixConflictComponent } from "./brnaches/fix-conflict/fix-conflict.component";
import { ScanFileComponent } from "./brnaches/scan-file/scan-file.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { ManageCheckingComponent } from "./documents/manage-checking/manage-checking.component";
import { SetConflictModalComponent } from "./documents/set-conflict-modal/set-conflict-modal.component";
import { ConfirmDocumentComponent } from "./documents/confirm-document/confirm-document.component";
import { CompleteScanModalComponent } from "./documents/complete-scan-modal/complete-scan-modal.component";
import { SetDocConflictModalComponent } from "./documents/set-doc-conflict-modal/set-doc-conflict-modal.component";
import { ScanFileSetComponent } from "./documents/scan-file-set/scan-file-set.component";
import { ReScanModalComponent } from "./documents/re-scan-modal/re-scan-modal.component";
import { ViewFileSetComponent } from "./documents/view-file-set/view-file-set.component";
import { ManageContradictionModalComponent } from "./documents/manage-contradiction-modal/manage-contradiction-modal.component";
import { UpdateDocConflictModalComponent } from "./documents/update-doc-conflict-modal/update-doc-conflict-modal.component";
import { InputNumberModule } from "primeng/inputnumber";
import { FileSearchComponent } from "./brnaches/file-search/file-search.component";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { AssignBranchComponent } from "./documents/assign-branch/assign-branch.component";
import { MatChipsModule } from "@angular/material/chips";
import { ManageRequestComponent } from "./brnaches/manage-request/manage-request.component";
import { RequestModalComponent } from "./brnaches/request-modal/request-modal.component";
import { ManageRequestDocumentComponent } from "./documents/manage-request-document/manage-request-document.component";
import { ConfirmRequestModalComponent } from "./documents/manage-request-document/confirm-request-modal/confirm-request-modal.component";
import { SendBranchModalComponent } from "./documents/manage-request-document/send-branch/send-branch-modal.component";
import { ReciveModalComponent } from "./brnaches/recive-modal/recive-modal.component";
import { BasicInformationComponent } from "./documents/basic-information/basic-information.component";
import { AddConflictModalComponent } from "./documents/basic-information/add-conflict-modal/add-conflict-modal.component";
import { EditConflictModalComponent } from "./documents/basic-information/edit-conflict-modal/edit-conflict-modal.component";
import { ScanFileConfirmComponent } from "./documents/scan-file-confirm/scan-file-confirm.component";
import { PaginatorModule } from "primeng/paginator";
import { ShowConfModalComponent } from './documents/show-conf-modal/show-conf-modal.component';
import { SearchDocumentOfficeComponent } from "./documents/search-document-office/search-document-office.component";
import { ManageUsersComponent } from './documents/manage-users/manage-users.component';
import { EditUserModalComponent } from './documents/manage-users/edit-user-modal/edit-user-modal.component';
import { SetConflictDocumentComponent } from './documents/set-conflict-document/set-conflict-document.component';
import { CreateUserModalComponent } from './documents/manage-users/create-user-modal/create-user-modal.component';
import { SetAllConflictModalComponent } from './documents/set-all-conflict-modal/set-all-conflict-modal.component';
import { DocumentSetReportsComponent } from './reports/document-set-reports/document-set-reports.component';
import { DocumentReportsComponent } from './reports/document-reports/document-reports.component';
import { EditDateRequestComponent } from './documents/manage-request-document/edit-date-request/edit-date-request.component';
import { AddReasonModalComponent } from './documents/basic-information/add-reason-modal/add-reason-modal.component';
import { EditReasonModalComponent } from './documents/basic-information/edit-reason-modal/edit-reason-modal.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {AddOtherDocumentComponent} from "./other-documents/add-file/add-other-document.component";
import {ConfirmOtherDocumentComponent} from "./other-documents/confirm-file/confirm-other-document.component";
import { EditOtherModalComponent } from './documents/basic-information/edit-other-modal/edit-other-modal.component';
import { OtherFileModalComponent } from './other-documents/other-file-modal/other-file-modal.component';
import { AddOtherModalComponent } from './documents/basic-information/add-other-modal/add-other-modal.component';
import { UpdateOtherDocumentComponent } from './other-documents/update-other-document/update-other-document.component';
import { DefaultOtherComponent } from './documents/basic-information/default-other/default-other.component';
import { SeeOtherDocumentComponent } from './other-documents/see-other-document/see-other-document.component';

@NgModule({
  declarations: [
    HomeComponent,
    ManageDocumentComponent,
    EditPackageComponent,
    ShowPackageComponent,
    AddPackageComponent,
    ConfirmPackageComponent,
    ManageCheckingComponent,
    ManageContradictionComponent,
    ManageContradictionInBranchComponent,
    ManageScanningComponent,
    TreeDirectoryComponent,
    FilePropertiesComponent,
    NoteComponent,
    GroupModificationComponent,
    DataModificationComponent,
    FileShowingComponent,
    TreeDocPagesComponent,
    InProgressComponent,
    BookmarkDirectoryComponent,
    VersionHistoryComponent,
    SearchDocumentComponent,
    FixConflictComponent,
    ScanFileSetComponent,
    ScanFileComponent,
    ScanFileConfirmComponent,
    ManageCheckingComponent,
    SetConflictModalComponent,
    ConfirmDocumentComponent,
    CompleteScanModalComponent,
    UpdateDocConflictModalComponent,
    SetDocConflictModalComponent,
    ReScanModalComponent,
    ViewFileSetComponent,
    ManageContradictionModalComponent,
    FileSearchComponent,
    AssignBranchComponent,
    ManageRequestComponent,
    ManageRequestDocumentComponent,
    ConfirmRequestModalComponent,
    SendBranchModalComponent,
    RequestModalComponent,
    ReciveModalComponent,
    BasicInformationComponent,
    AddConflictModalComponent,
    EditConflictModalComponent,
    ShowConfModalComponent,
    SearchDocumentOfficeComponent,
    ManageUsersComponent,
    EditUserModalComponent,
    SetConflictDocumentComponent,
    CreateUserModalComponent,
    SetAllConflictModalComponent,
    DocumentSetReportsComponent,
    DocumentReportsComponent,
    EditDateRequestComponent,
    AddReasonModalComponent,
    EditReasonModalComponent,
    AddOtherDocumentComponent,
    ConfirmOtherDocumentComponent,
    EditOtherModalComponent,
    OtherFileModalComponent,
    AddOtherModalComponent,
    UpdateOtherDocumentComponent,
    DefaultOtherComponent,
    SeeOtherDocumentComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
    MatListModule,
    FlexModule,
    NgxDocViewerModule,
    MatCardModule,
    MatSelectModule,
    MatExpansionModule,
    MatFormFieldModule,
    TableModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    TreeModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    NgbDropdownModule,
    TabViewModule,
    ButtonModule,
    MatTabsModule,
    DragDropModule,
    EditorModule,
    MatProgressSpinnerModule,
    InputNumberModule,
    PdfJsViewerModule,
    MatChipsModule,
    MatAutocompleteModule,
    PaginatorModule,
    MatButtonModule,
    MatBadgeModule,
    MatCheckboxModule,
  ],
  exports: [InProgressComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.min.js" },
  ],
})
export class MainModule {}
