import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DocumentModel } from "../../models/Document.model";
import { NoteService } from "../../services/note.service";
import { NoteModel } from "../../models/note.model";
import { MessageService } from "primeng/api";
import swal from "sweetalert2";
import { PersianCalendarService } from "../../../shared/services/persian-calendar.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-note",
  templateUrl: "./note.component.html",
  styleUrls: ["./note.component.css"],
})
export class NoteComponent implements OnInit, OnDestroy {
  @ViewChild("editor", { static: false }) public myEditor: any;
  content = "";
  @Input()
  document: DocumentModel;
  notes: NoteModel[] = [];
  disableSubmit = false;
  selectedNote: NoteModel;

  constructor(
    private noteService: NoteService,
    private toastr: ToastrService,
    private persianCalendarService: PersianCalendarService
  ) {}

  ngOnInit() {
    this.getAllNote(this.document.uuid);
  }

  showNote(note) {
    this.selectedNote = note;
    this.content = note.text;
    this.disableSubmit = true;
  }

  deleteNote(note) {
    swal
      .fire({
        title: "آیا از حذف یادداشت اطمینان دارید؟",
        text: "!شما قادر به برگرداندن موارد حذف شده نخواهید بود",
        showCancelButton: true,
        confirmButtonColor: "#820263",
        cancelButtonColor: "#625e61",
        cancelButtonText: "انصراف",
        confirmButtonText: "!بله حذف کن",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.noteService
            .deleteNote(note.path)
            .then((res) => {
              this.toastr.success("یادداشت با موفقیت حذف شد");
              const index = this.notes.indexOf(note, 0);
              if (index > -1) {
                this.notes.splice(index, 1);
              }
            })
            .catch((error) => {
              this.toastr.success("خطا در حذف یادداشت");
            });
        }
      });
  }

  getAllNote(uuid: string) {
    this.noteService
      .getAllNote(uuid)
      .then((res: any) => {
        if (res) {
          this.notes = [];
          if (res.constructor.name === "Array") {
            this.notes = res;
          } else if (res.constructor.name !== "Array") {
            this.notes.push(res);
          }
        }
      })
      .catch((error) => {
        this.toastr.success("خطا در دریافت یادداشت ها");
      });
  }

  saveNote() {
    if (this.selectedNote) {
      this.noteService
        .updateNote(this.selectedNote.path, this.content)
        .then((res) => {
          this.toastr.success("یادداشت با موفقیت ویرایش شد");
          this.cancelEditNote();
          this.getAllNote(this.document.uuid);
        })
        .catch((error) => {
          this.toastr.success("خطا در ویرایش یادداشت");
        });
    } else {
      this.noteService
        .saveNote(this.document.uuid, this.content)
        .then((res) => {
          this.toastr.success("یادداشت با موفقیت ذخیره شد");
          this.cancelEditNote();
          this.getAllNote(this.document.uuid);
        })
        .catch((error) => {
          this.toastr.success("خطا در ذخیره یادداشت");
        });
    }
  }

  cancelEditNote() {
    this.disableSubmit = false;
    this.content = "";
    this.selectedNote = null;
  }

  ngOnDestroy(): void {}

  getDate(date: string) {
    return this.persianCalendarService.getDate(date);
  }
}
