import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { DocumentEnumUtil } from "../../brnaches/manage-document/document-enum.util";
import { DocumentStateEnum } from "../../brnaches/manage-document/document-set-state.enum";
import { DocumentSetTypeEnum } from "../../brnaches/manage-document/document-set-type.enum";
import { DocumentSetModel } from "../../brnaches/manage-document/document-set.model";
import { BranchDtoModel } from "../../documents/assign-branch/branch.model";
import { ReportService } from "../../service/report.service";

@Component({
  selector: "app-document-reports",
  templateUrl: "./document-reports.component.html",
  styleUrls: ["./document-reports.component.scss"],
})
export class DocumentReportsComponent implements OnInit {
  public formGroup: FormGroup;
  documentSearchDto: DocumentSetModel = {};
  content: any;
  imageURL: SafeUrl;
  isLoading: boolean = false;
  typeKeys = Object.keys(DocumentSetTypeEnum).map((key) => ({
    label: DocumentSetTypeEnum[key],
    value: key,
  }));
  statusKeys = Object.keys(DocumentStateEnum).map((key) => ({
    label: DocumentStateEnum[key],
    value: key,
  }));
  typeBranchKeys: any[] = [];
  branchContentDropDown: BranchDtoModel[];

  roleName: string;

  fileTypeKeys: any[] = [];
  fileStatusKeys: any[] = [];
  otherDocumentType: any[] = [];

  typeOfFile: any[] = [];

  showOther: boolean = false;
  defaultFs: any = "";

  otherDocumentTypeLabel: any = "";
  branchLabel: any = "";
  statusLabel: any = "";
  typeLabel: any = "";
  fileTypeLabel: any = "";

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private reportService: ReportService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.roleName = localStorage.getItem("roleName");

    this.formGroup = this.formBuilder.group({
      type: new FormControl(""),
      status: new FormControl(""),
      creator: new FormControl(""),
      acceptor: new FormControl(""),
      branchIds: new FormControl(""),
      rowNumber: new FormControl(""),
      reason: new FormControl(""),
      maintenanceCode: new FormControl(""),
      documentNumber: new FormControl(""),
      customerNumber: new FormControl(""),
      fileNumber: new FormControl(""),
      fileTypeId: new FormControl(""),
      otherDocumentTypeId: new FormControl(""),
      fileStatusId: new FormControl(""),
    });

    this.reportService.getAllFileTypeList().then((res) => {
      this.typeOfFile = res;
      this.fileTypeKeys = this.typeOfFile.map((k) => ({
        label: k.title,
        value: k.title,
        id: k.id,
      }));
    });

    if (this.roleName === "DOEU") {
      this.reportService
        .getAllBranchesAssignList()
        .then((res: any) => {
          this.branchContentDropDown = res;
          this.branchContentDropDown.forEach((k) => {
            this.typeBranchKeys.push({
              label: k.branchName + "-" + k.branchCode,
              value: k.id,
            });
          });
          this.onPageChange({ first: 0, rows: this.itemsPerPage });
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    } else {
      this.reportService
        .getAllBranchesList()
        .then((res: any) => {
          this.branchContentDropDown = res;
          this.branchContentDropDown.forEach((k) => {
            this.typeBranchKeys.push({
              label: k.branchName + "-" + k.branchCode,
              value: k.id,
            });
          });
          this.onPageChange({ first: 0, rows: this.itemsPerPage });
        })
        .catch(() => {
          this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا");
        });
    }
  }

  setDocumentDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.documentDate = convertedDate;
    } else {
      this.documentSearchDto.documentDate = null;
    }
  }

  setStartDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.fromDate = convertedDate;
    } else {
      this.documentSearchDto.fromDate = null;
    }
  }

  setEndDate(event: any) {
    if (event) {
      const dateString = event;
      const date = new Date(dateString);

      const convertedDate = date.toISOString().substring(0, 10);

      this.documentSearchDto.toDate = convertedDate;
    } else {
      this.documentSearchDto.toDate = null;
    }
  }

  setType(event: any) {
    this.typeLabel = event.value.label;
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.type = DocumentEnumUtil.getValue(event.value);
    }
    if (event.value.value !== "DAILY" && event.value.value !== "CHAKAVAK") {
      this.showOther = true;
    } else {
      this.showOther = false;
      this.documentSearchDto.fileStatusId = null;
      this.documentSearchDto.fileTypeId = null;
      this.documentSearchDto.otherDocumentTypeId = null;
      this.documentSearchDto.customerNumber = null;
      this.documentSearchDto.fileNumber = null;
    }
  }

  setState(event: any) {
    if (DocumentEnumUtil.getValue(event.value) != null) {
      this.documentSearchDto.status = [DocumentEnumUtil.getValue(event.value)];
      this.statusLabel = event.value.label;
    }
  }

  setBranch(event: any) {
    this.documentSearchDto.branchIds = [event.value.value];
    this.branchLabel = event.value.label;
  }

  currentPageItems: any[] = [];
  itemsPerPage = 1500; // Number of items to display per page

  onPageChange(event: any) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    this.currentPageItems = this.typeBranchKeys.slice(startIndex, endIndex);
  }

  getExcelDocumentSet() {
    this.isLoading = true;
    this.reportService
      .getDocumentExcelReport(this.documentSearchDto)
      .subscribe((res: Blob) => {
        this.downloadBuffer(res, "file.xlsx");
        this.isLoading = false;
      });
  }

  downloadBuffer(arrayBuffer, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
    );
    this.content = this.sanitizer.bypassSecurityTrustUrl(
      URL.createObjectURL(
        new Blob([arrayBuffer], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        })
      )
    );
    this.imageURL = URL.createObjectURL(
      new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })
    );
    a.download = name;
    a.click();
  }

  resetSearchItems() {
    this.formGroup.reset();
    this.documentSearchDto = {};
    this.documentSearchDto.fromDate = null;
    this.documentSearchDto.toDate = null;
    this.documentSearchDto.registerFromDate = null;
    this.documentSearchDto.registerToDate = null;
    this.documentSearchDto.customerNumber = null;
    this.documentSearchDto.fileNumber = null;
    this.documentSearchDto.fileTypeId = null;
    this.documentSearchDto.otherDocumentTypeId = null;
    this.documentSearchDto.fileStatusId = null;
    this.defaultFs = "";
    this.otherDocumentType = [];
    this.fileStatusKeys = [];
    this.showOther = false;
  }

  setFileTypeId(event: any) {
    this.defaultFs = "";
    this.fileTypeLabel = event.value.label;
    const selectedType = event.value.value;

    this.documentSearchDto.fileTypeId = event.value.id;

    const selectedTypeObject = this.typeOfFile.find(
      (type) => type.title === selectedType
    );

    this.otherDocumentType = selectedTypeObject.otherDocumentTypes.map(
      (docType) => ({
        label: docType.title,
        value: docType.id,
      })
    );

    this.fileStatusKeys = selectedTypeObject.fileStatuses.map((status) => ({
      label: status.title,
      value: status.id,
      isDefault: status.isDefault,
    }));
    this.defaultFs = this.fileStatusKeys.find((k) => k.isDefault);
    this.documentSearchDto.fileStatusId = this.defaultFs.value;
  }

  setOtherDocumentTypeId(event: any) {
    this.documentSearchDto.otherDocumentTypeId = event.value.value;
    this.otherDocumentTypeLabel = event.value.label;
  }

  setFileStatusId(event: any) {
    this.documentSearchDto.fileStatusId = event.value.value;
  }
}
