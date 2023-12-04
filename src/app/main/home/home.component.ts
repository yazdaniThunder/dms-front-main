import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit, ViewChild } from "@angular/core";
import { interval } from "rxjs";
import { ISubscription } from "rxjs-compat/Subscription";
import { AnimationType } from "../../shared/components/carousel/carousel.animations";
import { CarouselComponent } from "../../shared/components/carousel/carousel.component";
import { HeaderService } from "../../shared/services/header.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  animations: [
    trigger("listAnimation", [
      transition("* => *", [
        // each time the binding value changes

        query(
          ":enter",
          [
            style({ opacity: 0 }),
            stagger(100, [animate("0.5s", style({ opacity: 1 }))]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  // @ts-ignore
  @ViewChild(CarouselComponent) carousel: CarouselComponent;

  animationType = AnimationType.JackInTheBox;
  subscription: ISubscription;
  isMobileSize = false;

  constructor(private headerService: HeaderService) {}

  ngOnInit() {
    this.headerService.setTypeHead("home");
    const source = interval(5000);
  }
}
