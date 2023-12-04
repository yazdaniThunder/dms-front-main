import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from "@angular/core";
import { RolesService } from "../services/roles.service";

@Directive({
  selector: "[requiredRoles]",
})
export class RequiredRolesDirective implements OnChanges {
  @Input() requiredRoles: string;

  constructor(
    private rolesService: RolesService,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
    // this.validateAccess();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.validateAccess();
  }

  private validateAccess(): void {
    // if (this.requiredRoles && !this.rolesService.hasRole(this.requiredRoles)) {
    // // if (!this.rolesService.hasRole(this.requiredRoles)) {
    //   this.renderer.setAttribute(this.elRef.nativeElement, "hidden", "true");
    //   this.renderer.setStyle(this.elRef.nativeElement, "cursor", "not-allowed");
    // }
  }
}
