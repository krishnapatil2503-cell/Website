import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  Inject,
  LOCALE_ID,
} from "@angular/core";
import { faBars, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [
    "./header.component.scss",
    "./header.component.responsivity.scss",
  ],
})
export class HeaderComponent implements OnInit {
  private _activeSection: any;
  private _pageXOffset: any;

  hasMenuToggled: boolean;
  faBars: IconDefinition;
  name: string;
  yearsOld: number;

  @ViewChild("nav") nav: ElementRef;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private renderer: Renderer2
  ) {}

  // use getter setter to define the properties
  get activeSection(): any {
    return this._activeSection;
  }

  get pageXOffset(): any {
    return this._pageXOffset;
  }

  @Input()
  set pageXOffset(value: any) {
    this._pageXOffset = value;
    this.onDetectScreenSize();
  }

  @Input()
  set activeSection(value: any) {
    this._activeSection = value;
    this.updateNavigation();
  }

  ngOnInit(): void {
    this.faBars = faBars;
    this.name = environment.personal.name;
    this.yearsOld = this.calcAge(environment.personal.birth);
  }

  private updateNavigation() {
    if (this._activeSection && this.renderer) {
      // Remove any selected anchor
      const activePreviousElem =
        this.nav.nativeElement.querySelector("a.active");

      if (activePreviousElem) {
        this.renderer.removeClass(activePreviousElem, "active");
      }

      const targetElem = this.nav.nativeElement.querySelector(
        `a[href^="#${this._activeSection}"]`
      );
      if (targetElem) {
        this.renderer.addClass(targetElem, "active");
      }
    }
  }

  /*
   * For media types such as tablets and mobile devices, the nav-bar navigation should be
   * collapsed by default.
   */
  private onDetectScreenSize() {
    this.hasMenuToggled = this.pageXOffset > 1024;
  }

  onToggleBar() {
    this.hasMenuToggled = !this.hasMenuToggled;
  }

  resetMenu() {
    this.hasMenuToggled = this.pageXOffset > 1024;
  }

  private calcAge(dateString: string) {
    const birthday: Date = new Date(dateString);
    const ageDifMs: number = Date.now() - birthday.getTime();
    const ageDate: Date = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getFullYear() - 1970);
  }
}
