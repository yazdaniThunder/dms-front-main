import { Component, OnInit } from '@angular/core';
import {LoadingService} from '../service/Loading.service';


@Component({
  selector: 'app-in-progress',
  templateUrl: './in-progress.component.html',
  styleUrls: ['./in-progress.component.css']
})
export class InProgressComponent implements OnInit {

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
  }

  loading(): boolean {
    return (this.loadingService.loadingCounter > 0);
  }

}
