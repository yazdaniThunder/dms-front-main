import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TreeNode } from "primeng/api";
import swal from "sweetalert2";
import * as uuid from "uuid";
import { FolderService } from "../../../main/service/folder.service";
import { HeaderService } from "../../../shared/services/header.service";
import { DocChildrenResModel } from "../../models/doc-children-res.model";
import { DocumentModel } from "../../models/Document.model";
import { FolderModel } from "../../models/folder.model";
import { GetPathResModel } from "../../models/get-path-res.model";
import { TreeService } from "../../services/tree.service";

@Component({
  selector: " app-tree-root",
  templateUrl: "./tree-root.component.html",
  styleUrls: ["./tree-root.component.scss"],
})
export class TreeRootComponent implements OnInit {
  nodes: TreeNode[];
  localStorage: Storage;
  treeList: any[];
  jsonValueChildrenStr: string;
  jsonValueChildrenDoc: string;
  pathName: string;
  pathResult: GetPathResModel;
  childrenRes: FolderModel[];
  childrenDocRes: DocChildrenResModel;
  childrenList: FolderModel[];
  childrenDocList: DocumentModel[];
  createBody: FolderModel[];
  showList = false;
  readOnlyState = true;
  searchInput: string;
  public formGroup: FormGroup;
  @ViewChild("myNameElem", { static: false }) myNameElem: ElementRef;
  path = "";
  ngbModalRef: NgbModalRef;
  selectedNodeForUpload: string;

  constructor(
    private router: Router,
    private folderService: FolderService,
    private modalService: NgbModal,
    private headerService: HeaderService,
    private formBuilder: FormBuilder,
    private treeService: TreeService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      text: [this.searchInput],
    });
    this.localStorage = window.localStorage;
    this.headerService.setTypeHead("upload");
    this.callApiGetMainRoot();
  }

  addFolder(node) {
    swal
      .fire({
        title: "لطفا نام پوشه را وارد کنید",
        html:
          '<br /><form method="post" id="taxcode-update" name="taxcodeUpdate">' +
          '<input style="text-align: right" id="swal-input2" minlength="3" ' +
          'class="form-control wedding-input-text wizard-input-pad" type="text" name="taxCode" placeholder="نام پوشه"></form>',
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله تایید کن",
        reverseButtons: true,
      })
      .then((result) => {
        const path2 =
          node.path +
          "/" +
          (
            document.getElementById(
              "swal-input2"
            ) as unknown as HTMLInputElement
          ).value;
        const uuid22 = uuid.v4();
        this.createBody = [
          {
            author: "okmAdmin",
            created: "2022-11-20T19:37:26.499Z",
            path: path2.toString(),
            uuid: uuid22.toString(),
            subscribed: true,
            hasChildren: true,
          },
        ];
        this.folderService.createFolder(path2.toString()).then((res) => {
          if (result.value) {
            this.getChildren(node);
          }
        });
      });
  }

  expendNode(node) {
    node.expanded = node.expanded !== true;
    this.getChildren(node);
  }

  openNode(node) {
    // tslint:disable-next-line:no-shadowed-variable
    this.nodes
      .filter((node) => node.leaf)
      .forEach((nod) => (nod.leaf = !nod.leaf));
    node.leaf = !node.leaf;
    if (node.children.length === 0) {
    }
  }

  openAllNode(key) {
    if (key && document && document.getElementById("small-icon" + key)) {
      // @ts-ignore
      document.getElementById("small-icon" + key).classList.add("showIcon");
    }
  }

  convertListToTree(list) {
    if (list) {
      // tslint:disable-next-line:one-variable-per-declaration prefer-const
      let map = {},
        node,
        roots = [],
        i;

      for (i = 0; i < list.length; i += 1) {
        map[list[i].key] = i; // initialize the map
        list[i].children = []; // initialize the children
      }
      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parentId !== "0") {
          // if you have dangling branches check that map[node.parentId] exists
          list[map[node.parentId]].children.push(node);
        } else {
          roots.push(node);
        }
      }
      return roots;
    }
  }

  closeNode(node) {
    node.expanded = false;
    this.callApiGetChildFolder(node);
  }

  private getChildren(node) {
    this.treeService
      .getFolder(node.key)
      .then((res) => {
        node.children = res;
        this.jsonValueChildrenStr = JSON.stringify(res);
        this.childrenRes = JSON.parse(JSON.stringify(res));

        this.pathName = "path : " + " " + node.label;
        this.localStorage.setItem("pathSelected", this.pathResult.path);
        this.localStorage.setItem("uuidPathSelected", this.pathResult.uuid);
        if (this.jsonValueChildrenStr.includes("{}")) {
          this.router.navigate(["/main/tree-directory/" + node.key]);
        } else if (this.jsonValueChildrenStr.includes("[{")) {
          this.childrenList = this.childrenRes;

          this.router.navigate(["/main/tree-directory/" + node.key]);
          for (let i = 0; i < this.childrenRes.length; i += 1) {
            this.childrenList[i].type = "folder";
            if (
              this.treeList.filter(
                (item) => item.key === this.childrenRes[i].uuid
              ).length === 0
            ) {
              let label: string = this.childrenRes[i].path;
              const split = label.split("/", 10);
              let customName = this.createPathStr(split);
              this.treeList.push({
                key: this.childrenRes[i].uuid,
                label: customName,
                path: this.childrenRes[i].path,
                parentId: node.key,
              });
              this.treeList.filter((k) =>
                k.path === "/okm:root/province"
                  ? (k.label = "درختواره دسته اسناد")
                  : (k.label = k.label)
              );
              this.treeList.filter((k) =>
                k.path === "/okm:root/otherDocument"
                  ? (k.label = "درختواره سایر اسناد")
                  : (k.label = k.label)
              );
            }
          }
          this.nodes = this.convertListToTree(this.treeList);
          // this.cd.detectChanges();
        } else if (this.jsonValueChildrenStr.startsWith('{"folder":{')) {
          const childrenRes = JSON.parse(JSON.stringify(res));
          this.router.navigate(["/main/tree-directory/" + node.key]);

          if (
            this.treeList.filter((item) => item.key == childrenRes.folder.uuid)
              .length == 0
          ) {
            let label: string = childrenRes.folder.path;
            const split = label.split("/", 10);
            let customName = this.createPathStr(split);
            this.treeList.push({
              key: childrenRes.folder.uuid,
              path: childrenRes.folder.path,
              label: customName,
              parentId: node.key,
            });
            this.treeList.filter((k) =>
              k.path === "/okm:root/province"
                ? (k.label = "درختواره دسته اسناد")
                : (k.label = k.label)
            );
            this.treeList.filter((k) =>
              k.path === "/okm:root/otherDocument"
                ? (k.label = "درختواره سایر اسناد")
                : (k.label = k.label)
            );
          }
          this.nodes = this.convertListToTree(this.treeList);
        } else {
          this.router.navigate(["/main/tree-directory/" + node.key]);
        }
      })
      .catch((error) => {});
    this.showList = true;
  }

  private createPathStr(split: string[]) {
    return split[split.length - 1];
  }

  callApiGetMainRoot() {
    this.pathResult = {
      author: "okmAdmin",
      created: "2023-06-22T03:34:29-04:00",
      hasChildren: true,
      path: "/okm:root",
      permissions: 15,
      subscribed: false,
      uuid: null,
    };
    this.pathName = "path : " + " " + this.pathResult.path;
    this.pathName = "درختواره";
    this.localStorage.setItem("pathSelected", this.pathResult.path);
    this.localStorage.setItem("uuidPathSelected", this.pathResult.uuid);

    this.treeList = [
      {
        key: this.pathResult.uuid,
        label: "درختواره",
        path: "/okm:root",
        parentId: "0",
      },
    ];
    this.nodes = this.convertListToTree(this.treeList);
  }

  callApiGetChildFolder(node) {
    this.treeService.getFolder(node.key).then((data) => {
      this.pathName = "path : " + " " + node.label;
      this.jsonValueChildrenStr = JSON.stringify(data);
      this.childrenRes = JSON.parse(JSON.stringify(data));
      this.localStorage.setItem("pathSelected", this.pathResult.path);
      this.localStorage.setItem("uuidPathSelected", this.pathResult.uuid);
      this.childrenList = this.childrenRes;
    });
  }

  editIcon(node: any): void {
    const split = node.path.split("/", 10);
    let name = this.createPathStr(split);
    swal
      .fire({
        title: "لطفا نام جدید پوشه را وارد کنید",
        html:
          '<br /><form method="post" id="taxcode-update" name="taxcodeUpdate">' +
          '<input style="text-align: right" id="swal-input1" minlength="3" ' +
          'class="form-control wedding-input-text wizard-input-pad" type="text" name="taxCode" ' +
          "></form>",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله تایید کن",
        inputPlaceholder: node.label,
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          const newName = (
            document.getElementById("swal-input1") as HTMLInputElement
          ).value;
          this.folderService
            .renameFolder(node.key, newName)
            .then((res) => {
              const filter = this.treeList.filter(
                (item) => item.key === node.key
              );
              const index = this.treeList.indexOf(filter[0], 0);
              if (index > -1) {
                this.treeList[index].label = newName;
              }
            })
            .catch((error) => {
              //
            });
        }
      });
  }

  showIcon(key: any): void {
    if (key && document && document.getElementById("icon" + key)) {
      // @ts-ignore
      document.getElementById("icon" + key).classList.add("showIcon");
    }
  }

  hideIcon(key: any): void {
    if (key && document && document.getElementById("icon" + key)) {
      // @ts-ignore
      document.getElementById("icon" + key).classList.remove("showIcon");
    }
    if (key && document && document.getElementById("small-icon" + key)) {
      // @ts-ignore
      document.getElementById("small-icon" + key).classList.remove("showIcon");
    }
  }

  removeNode(node: TreeNode) {
    swal
      .fire({
        title: "آیا حذف پوشه انتخاب شده را تایید می کنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله حذف کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.folderService.deleteFolder(node.key).then((res) => {
            if (result.value) {
              // this.products
              const index: number = this.treeList.indexOf(node);
              if (index !== -1) {
                this.treeList.splice(index, 1);
              }
              if (node.children != null) {
                for (let i = 0; i < node.children.length; i++) {
                  this.removeNode(node.children[i]);
                }
              }
              this.nodes = this.convertListToTree(this.treeList);
            }
          });
        }
      });
  }

  editContent(node: any) {
    this.readOnlyState = false;
  }

  getUploadedDoc(event: DocumentModel) {
    const split = event.path.split("/", 10);
    event.title = split[split.length - 1];
    this.modalService.dismissAll();
    this.router.navigate([
      "/main/tree-directory/" + this.selectedNodeForUpload,
    ]);
  }

  uploadFile(node, content) {
    this.path = node.path + "/";
    this.selectedNodeForUpload = node.key;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {});
  }

  bookmark() {
    this.router.navigate(["main/bookmark-directory"]).then((r) => null);
  }
}
