import { Component, Input, OnInit } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import swal from "sweetalert2";
import { MetadataService } from "../../services/metadata.service";
import { DocumentModel } from "../../models/Document.model";
import { DocumentSetTypeEnum } from "../../../main/brnaches/manage-document/document-set-type.enum";
import { DocumentService } from "../../services/document.service";
import { FixedMetadataModel } from "../../models/fixed-metadata.model";
import { ToastrService } from "ngx-toastr";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { TransactionTypeEnum } from "../../../main/documents/scan-file-set/scan-file-set.component";

@Component({
  selector: "app-data-modification",
  templateUrl: "./data-modification.component.html",
  styleUrls: ["./data-modification.component.scss"],
})
export class DataModificationComponent implements OnInit {
  groups: FixedMetadataModel[] = [];
  AllGroups: FixedMetadataModel[] = [];
  @Input()
  document: DocumentModel;
  selectedCategories: string[];
  stateOneOptions = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  stateTwoOptions = Object.keys(TransactionTypeEnum).map((key) => ({
    label: TransactionTypeEnum[key],
    value: key,
  }));
  stateThreeOptions: any[] = [];
  fixedMetadata: FixedMetadataModel[] = [];
  fixed2: FixedMetadataModel[] = [];
  fixed3: FixedMetadataModel[] = [];
  fixed4: FixedMetadataModel[] = [];
  beforeRemoveItems: FixedMetadataModel[] = [];
  fixedSelected: Map<string, FixedMetadataModel> = new Map([
    ["documentClass", null],
    ["documentSetType", null],
    ["documentDescription", null],
  ]);
  allFixedKeys: string[] = [
    "documentClass",
    "documentSetType",
    "documentDescription",
  ];
  public formGroup: FormGroup;
  bindOne: any = {};
  bindTwo: any = {};
  bindThree: any = {};
  bindFour: any = {};
  currentPageItems: any[] = [];
  itemsPerPage = 1500; // Number of items to display per page

  isTextExtracted: boolean;
  constructor(
    private metadataService: MetadataService,
    private formBuilder: FormBuilder,
    private documentService: DocumentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllFixedMetadata();
    this.getAllMetadata();
    this.getDocumentTypes();
    this.selectedCategories = [];
    this.documentService.getNodeDocumentUuid(this.document.uuid).then((res) => {
      this.isTextExtracted = res.textExtracted;
    });

    this.getMetadataById(this.document.uuid);
    this.formGroup = this.formBuilder.group({
      fixedOne: new FormControl(""),
      fixedTwo: new FormControl(""),
      fixedThree: new FormControl(""),
      fixedFour: new FormControl(""),
    });
  }

  getDocumentTypes() {
    this.metadataService.getAllDocumentTypes(0, 1500).then((res: any) => {
      if (res.content && Array.isArray(res.content)) {
        res.content.forEach((item) => {
          this.stateThreeOptions.push(item);
        });
      } else {
        this.stateThreeOptions = res.content;
      }
      this.onPageChange({ first: 0, rows: this.itemsPerPage });
      this.setAllFixedMetadataToDropdown();
    });
  }
  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItems = this.stateThreeOptions.slice(startIndex, endIndex);
  }

  getAllFixedMetadata() {
    this.metadataService.getFixedMetadata().then((res) => {
      this.fixedMetadata = res;
      this.fixedMetadata.map((item) => (item.label = item.name));
    });
  }

  removeFromChild() {
    let filteredGroup;
    let index;
    this.allFixedKeys.forEach((key) => {
      filteredGroup = this.groups.filter((item) => item.name == key);
      index = this.groups.indexOf(filteredGroup[0], 0);
      if (index > -1) {
        this.fixedSelected.set(filteredGroup[0].name, filteredGroup[0]);
        this.groups.splice(index, 1);
      }
    });
  }

  setAllFixedMetadataToDropdown() {
    this.fixedSelected.forEach((value:any, key) => {
      if (value && value.fieldName === "documentSetType") {
        let val =
          Object.keys(DocumentSetTypeEnum)[
            Object.values(DocumentSetTypeEnum).indexOf(value.value)
          ];
        this.bindOne = { label: value.value, value: val };
      }
      if (value && value.fieldName === "documentClass") {
        let val =
          Object.keys(TransactionTypeEnum)[
            Object.values(TransactionTypeEnum).indexOf(value.value)
          ];
        this.bindTwo = { label: value.value, value: val };
      }
      if (value && value.fieldName === "documentDescription") {
        let filteredGroup = this.stateThreeOptions.filter(
          (item) => item.title == value.value
        );
        let index = this.stateThreeOptions.indexOf(filteredGroup[0], 0);
        if (index > -1) {
          this.bindThree = this.stateThreeOptions[index];
        }
      }
    });
  }

  removeFromParent() {
    this.AllGroups.forEach((item) => this.beforeRemoveItems.push(item));
    const removableItems: FixedMetadataModel[] = [];
    this.groups.forEach((item) => {
      this.AllGroups.forEach((exItem) => {
        if (exItem.fieldName === item.name) {
          removableItems.push(exItem);
        }
      });
    });
    removableItems.forEach((remove) => {
      const index = this.AllGroups.indexOf(remove, 0);
      if (index > -1) {
        this.AllGroups.splice(index, 1);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  confirmDoc() {
    swal
      .fire({
        title: "آیا اصلاح فرا داده را تایید می کنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        inputPlaceholder: "وارد کنید",
        confirmButtonText: "!بله تایید کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.submitGroup();
        }
      });
  }

  submitGroup() {
    let removableItems = this.checkItemsForRemove();
    let metadata = [];
    this.groups.forEach((eve) => {
      metadata.push({ name: eve.fieldName, value: eve.value });
    });
    if (removableItems && removableItems.length > 0) {
      removableItems.forEach((item) => {
        metadata.push({ name: item.name, value: "null" });
      });
    }
    if (this.bindOne) {
      metadata.push({ name: "documentSetType", value: this.bindOne.label });
    }
    if (this.bindTwo) {
      metadata.push({ name: "documentClass", value: this.bindTwo.value });
    }
    if (this.bindThree) {
      metadata.push({
        name: "documentDescription",
        value: this.bindThree.title,
      });
    }

    let body = {
      uuid: this.document.uuid,
      metadata: metadata,
    };
    if (body) {
      this.metadataService
        .saveGroup(body)
        .then((res) => {
          this.toastr.success("تخصیص گروه با موفقیت انجام شد");
        })
        .catch((error) => {
          this.toastr.error("خطا در تخصیص گروه", "خطا");
        });
    }
  }

  private checkItemsForRemove(): any[] {
    let removableItems = [];
    this.AllGroups.forEach((item) => {
      if (!this.beforeRemoveItems.includes(item)) {
        removableItems.push(item);
      }
    });
    return removableItems;
  }

  removeMetadataGroups(groupName: string) {
    this.metadataService
      .deleteMetaData(this.document.uuid, groupName)
      .then((res) => {
        this.toastr.success("تخصیص گروه با موفقیت انجام شد");
      })
      .catch((error) => {
        this.toastr.error("خطا در تخصیص گروه", "خطا");
      });
  }

  getLabelFromName(name: string) {
    switch (name) {
      case "branchCode":
        return "کد شعبه";
      case "documentNo":
        return "شماره سند";
      case "documentDescription":
        return "شرح سند ";
      case "documentClass":
        return "طبقه سند";
      case "documentSetType":
        return "نوع دسته سند";
      case "documentType":
        return "نوع سند";
      case "date":
        return "تاریخ سند";
    }
  }

  getAllMetadata() {
    this.AllGroups = [
      {
        label: "کد شعبه",
        name: "okg:branchcode",
        fieldName: "branchCode",
        readonly: "false",
        visible: 1,
      },
      {
        label: "شماره سند ",
        name: "okg:docnumber",
        fieldName: "documentNo",
        readonly: "false",
        visible: 1,
      },
      {
        label: "تاریخ سند",
        name: "okg:docdate",
        fieldName: "date",
        readonly: "false",
        visible: 1,
      },
    ];
  }

  getMetadataById(uuid: string) {
    this.metadataService.getMetadataById(uuid).then((res: any) => {
      let filterArray = res.filter((item) => item.value != "null");
      filterArray.map((item) => {
        item.label = this.getLabelFromName(item.name);
        item.fieldName = item.name;
      });
      this.groups = filterArray;
      this.removeFromParent();
      this.removeFromChild();
    });
  }

  setFixedTwo(event: any, item?: any) {}

  setFixedThree(event: any, item?: any) {}

  setFixedFour(event: any, item?: any) {}
  setFixedFive(event: any) {}
}
