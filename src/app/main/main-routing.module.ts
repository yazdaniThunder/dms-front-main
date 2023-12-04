import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BookmarkDirectoryComponent } from "../data-tree/components/bookmark-directory/bookmark-directory.component";
import { TreeDirectoryComponent } from "../data-tree/components/tree-directory/tree-directory.component";
import { AuthGuard } from "../shared/services/auth-guard.service";
import { ConfirmPackageComponent } from "./brnaches/confirm-package/confirm-package.component";
import { FileSearchComponent } from "./brnaches/file-search/file-search.component";
import { ManageContradictionInBranchComponent } from "./brnaches/manage-contradiction-in-branch/manage-contradiction-in-branch.component";
import { ManageDocumentComponent } from "./brnaches/manage-document/manage-document.component";
import { ManageRequestComponent } from "./brnaches/manage-request/manage-request.component";
import { SearchDocumentComponent } from "./brnaches/search-document/search-document.component";
import { AssignBranchComponent } from "./documents/assign-branch/assign-branch.component";
import { BasicInformationComponent } from "./documents/basic-information/basic-information.component";
import { ConfirmDocumentComponent } from "./documents/confirm-document/confirm-document.component";
import { ManageCheckingComponent } from "./documents/manage-checking/manage-checking.component";
import { ManageContradictionComponent } from "./documents/manage-contradiction/manage-contradiction.component";
import { ManageRequestDocumentComponent } from "./documents/manage-request-document/manage-request-document.component";
import { ManageScanningComponent } from "./documents/manage-scanning/manage-scanning.component";
import { ManageUsersComponent } from "./documents/manage-users/manage-users.component";
import { SearchDocumentOfficeComponent } from "./documents/search-document-office/search-document-office.component";
import { HomeComponent } from "./home/home.component";
import { AddOtherDocumentComponent } from "./other-documents/add-file/add-other-document.component";
import { ConfirmOtherDocumentComponent } from "./other-documents/confirm-file/confirm-other-document.component";
import { DocumentReportsComponent } from "./reports/document-reports/document-reports.component";
import { DocumentSetReportsComponent } from "./reports/document-set-reports/document-set-reports.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },

  {
    path: "",
    canActivateChild: [AuthGuard],
    children: [
      {
        path: "home",
        component: HomeComponent,
        data: {
          title: "Home",
          roles: ["ADMIN", "BU", "BA", "DOA", "DOPU", "DOEU", "RU"],
        },
      },
      {
        path: "manage-document",
        component: ManageDocumentComponent,
        data: {
          title: "ManageDocument",
          roles: ["ADMIN", "BU", "BA"],
        },
      },
      {
        path: "search-document",
        component: SearchDocumentComponent,
        data: {
          title: "SearchDocument",
          roles: ["ADMIN", "BU", "BA", "DOA", "DOPU", "DOEU"],
        },
      },
      {
        path: "search-document-office",
        component: SearchDocumentOfficeComponent,
        data: {
          title: "SearchDocument",
          roles: ["ADMIN", "DOA", "DOPU", "DOEU"],
        },
      },
      {
        path: "manage-users",
        component: ManageUsersComponent,
        data: {
          title: "ManageUsers",
          roles: ["ADMIN", "DOA"],
        },
      },
      {
        path: "file-search",
        component: FileSearchComponent,
        data: {
          title: "FileSearch",
          roles: ["ADMIN", "BU", "BA", "DOA", "DOPU", "DOEU", "RU"],
        },
      },
      {
        path: "confirm-package",
        component: ConfirmPackageComponent,
        data: {
          title: "ConfirmPackage",
          roles: ["ADMIN", "BA"],
        },
      },
      {
        path: "manage-contradiction-in-branch",
        component: ManageContradictionInBranchComponent,
        data: {
          title: "ManageContradictionInBranch",
          roles: ["ADMIN", "BU", "BA"],
        },
      },
      {
        path: "branch-assignment",
        component: AssignBranchComponent,
        data: {
          title: "BranchAssignment",
          roles: ["ADMIN", "DOA"],
        },
      },
      {
        path: "manage-checking",
        component: ManageCheckingComponent,
        data: {
          title: "ManageChecking",
          roles: ["ADMIN", "DOA", "DOPU"],
        },
      },
      {
        path: "confirm-documents",
        component: ConfirmDocumentComponent,
        data: {
          title: "ConfirmDocuments",
          roles: ["ADMIN", "DOA"],
        },
      },
      {
        path: "manage-scanning",
        component: ManageScanningComponent,
        data: {
          title: "ManageScanning",
          roles: ["ADMIN", "DOA", "DOEU"],
        },
      },
      {
        path: "manage-contradiction",
        component: ManageContradictionComponent,
        data: {
          title: "ManageContradiction",
          roles: ["ADMIN", "DOA", "DOEU"],
        },
      },
      {
        path: "tree-directory/:uuid",
        component: TreeDirectoryComponent,
        data: {
          title: "TreeDirectoryComponent",
          roles: ["ADMIN", "BU", "BA", "DOA", "DOPU", "DOEU"],
        },
      },
      {
        path: "bookmark-directory",
        component: BookmarkDirectoryComponent,
        data: {
          title: "BookmarkDirectoryComponent",
          roles: ["ADMIN", "BU", "BA", "DOA", "DOPU", "DOEU"],
        },
      },
      {
        path: "manage-request-in-branch",
        component: ManageRequestComponent,
        data: {
          title: "ManageRequestComponent",
          roles: ["ADMIN", "BU", "BA", "RU"],
        },
      },
      {
        path: "manage-request-document",
        component: ManageRequestDocumentComponent,
        data: {
          title: "ManageRequestDocumentComponent",
          roles: ["ADMIN", "DOA", "DOPU"],
        },
      },
      {
        path: "basic-information",
        component: BasicInformationComponent,
        data: {
          title: "BasicInformationComponent",
          roles: ["ADMIN", "DOA"],
        },
      },
      {
        path: "document-set-reports",
        component: DocumentSetReportsComponent,
        data: {
          title: "DocumentSetReportsComponent",
          roles: ["ADMIN", "RU", "DOPU"],
        },
      },
      {
        path: "document-reports",
        component: DocumentReportsComponent,
        data: {
          title: "DocumentReportsComponent",
          roles: ["ADMIN", "RU", "DOEU"],
        },
      },
      {
        path: "add-other-file",
        component: AddOtherDocumentComponent,
        data: {
          title: "AddOtherDocumentComponent",
          roles: ["ADMIN", "BA", "BU"],
        },
      },
      {
        path: "confirm-other-file",
        component: ConfirmOtherDocumentComponent,
        data: {
          title: "ConfirmOtherDocumentComponent",
          roles: ["ADMIN", "BA"],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
