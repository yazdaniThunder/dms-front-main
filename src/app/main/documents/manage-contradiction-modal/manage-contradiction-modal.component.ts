import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ManageCheckingService } from "../../service/manageChecking.service";
import { SetDocConflictModel } from "../manage-checking/set-doc-coflict.model";
import swal from "sweetalert2";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { PersianCalendarService } from "src/app/shared/services/persian-calendar.service";
import { ManageFileService } from "../../service/manage-file.service";
import { ConflictModel } from "../../brnaches/manage-contradiction-in-branch/conflict.model";
import { FileContradictionModel } from "../../brnaches/manage-contradiction-in-branch/file-contradiction.model";

@Component({
  selector: "app-manage-contradiction-modal",
  templateUrl: "./manage-contradiction-modal.component.html",
  styleUrls: ["./manage-contradiction-modal.component.scss"],
})
export class ManageContradictionModalComponent implements OnInit {
  @Input()
  documentModel: FileContradictionModel;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Output() passModalEntry: EventEmitter<any> = new EventEmitter();
  selectedIds: number[] = [];
  selectedDoc: FileContradictionModel;
  conflicts: ConflictModel[] = [];
  conflictsId: number[] = [];
  newConflictId = [];

  private ngbModalRef: NgbModalRef;

  public setDocConflictModel: SetDocConflictModel = {};

  selectedReason: any;

  public formGroup: FormGroup;
  description: string;

  docId: number;
  constructor(
    private toastr: ToastrService,
    private manageCheckingService: ManageCheckingService,
    private modalService: NgbModal,
    private persianCalendarService: PersianCalendarService,
    private manageFileService: ManageFileService
  ) {}

  ngOnInit() {
    this.docId = this.documentModel.id;
    this.conflictsId = this.documentModel.conflicts.map((item) => item.id);
    this.setDocConflictModel.documentId = this.documentModel.id;
  }

  openModalClick(content, selectedDoc?: FileContradictionModel) {
    this.selectedDoc = selectedDoc;
    this.ngbModalRef = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
    });
    this.ngbModalRef.result.then((result) => {
      this.passModalEntry.emit();
    });
  }

  deleteConflicting() {
    swal
      .fire({
        title: "آیا از حذف مغایرت سند اطمینان دارید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله تایید کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.manageCheckingService.deleteDocConflict(this.docId).then(() => {
            this.toastr.success(" حذف مغایرت سند با موفقیت انجام شد.");
            this.selectedIds = [];
            this.manageFileService
              .getDocumentById(this.documentModel.id)
              .then((res) => {
                this.documentModel = res;
                this.passEntry.emit();
              });
          });
        }
      })
      .catch(() =>
        this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
      );
  }

  submit() {
    swal
      .fire({
        title: "آیا ثبت مغایرت دسته اسناد را تایید می کنید؟",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        inputPlaceholder: "وارد کنید",
        reverseButtons: true,
        confirmButtonText: "!بله تایید کن",
      })
      .then((result) => {
        if (result.value) {
          let request: any = {
            id: this.documentModel.conflicts[0].id,
            registerDescription: this.description,
            resolveDescription: this.description,
            conflictReasons: [{ reason: this.selectedReason.value }],
          };
          this.manageCheckingService
            .updateConflictDoc(request)
            .then(() => {
              this.toastr.success("ثبت مغایرت  با موفقیت انجام شد.");
              this.passEntry.emit();
            })
            .catch(() =>
              this.toastr.error("مشکل ارتباط با سرور، مجدد تلاش نمایید!", "خطا")
            );
        }
      });
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      var someDate = new Date(sendDate);
      return this.persianCalendarService.PersianCalendarNumeric(someDate);
    }
  }

  cancel() {
    this.passEntry.emit();
  }

  submitNew() {
    this.ngbModalRef.close();
    this.passEntry.emit();
  }

  setReason(event: any) {
    this.setDocConflictModel.conflictReasons.map(
      (item) => (item = event.value.value)
    );
  }
}
