import {Component, Input, OnInit} from '@angular/core';
import {DocumentModel} from '../../models/Document.model';

@Component({
  selector: "app-tree-doc-pages",
  templateUrl: "./tree-doc-pages.component.html",
  styleUrls: ["./tree-doc-pages.component.css"],
})
export class TreeDocPagesComponent implements OnInit {
  @Input()
  document: DocumentModel;

  constructor() {}

  ngOnInit() {
  }
}
