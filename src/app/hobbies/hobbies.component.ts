import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  ViewChild,
  HostListener,
} from "@angular/core";
import { DataService } from "../core/data.service";
import { SorterService } from "../core/sorter.service";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { IHobby } from "./hobbies-interfaces";

@Component({
  selector: "app-hobbies",
  templateUrl: "./hobbies.component.html",
  styleUrls: [
    "./hobbies.component.scss",
    "./hobbies.component.responsivity.scss",
  ],
})
export class HobbiesComponent implements OnInit, OnDestroy {
  hobbies: IHobby[] = [];
  hobbiesOrdered: IHobby[] = [];
  extracurricular: IHobby[] = [];
  extracurricularOrdered: IHobby[] = [];
  backgroundUrl: string = "";
  currentPosition: number = 1;
  activeMainTab: string = "hobbies";
  private intersectionObserver: IntersectionObserver;

  @ViewChild("contentScrollContainer") contentScrollContainer: ElementRef;

  constructor(
    private dataService: DataService,
    private sortService: SorterService,
    private renderer: Renderer2,
    private library: FaIconLibrary
  ) {
    library.addIconPacks(fas);
  }

  ngOnInit(): void {
    // Load hobbies data
    this.dataService.getHobbies().subscribe((hobbies: IHobby[]) => {
      console.log("Loaded hobbies:", hobbies);
      this.hobbies = hobbies;
      this.hobbiesOrdered = [...hobbies];
      this.hobbiesOrdered.sort(this.sortService.sort("position", "desc"));
      console.log("Hobbies ordered:", this.hobbiesOrdered);

      // Initialize after data loads
      this.initializeComponent();
    });

    // Load extracurricular data
    this.dataService
      .getExtracurricular()
      .subscribe((extracurricular: IHobby[]) => {
        console.log("Loaded extracurricular:", extracurricular);
        this.extracurricular = extracurricular;
        this.extracurricularOrdered = [...extracurricular];
        this.extracurricularOrdered.sort(
          this.sortService.sort("position", "desc")
        );
        console.log("Extracurricular ordered:", this.extracurricularOrdered);
      });

    document.documentElement.style.setProperty(
      "--hobby-count",
      "3" // Both sections have 3 items each
    );

    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 100);
  }

  private initializeComponent(): void {
    // Initialize with hobbies data
    this.currentPosition = 1;
    this.backgroundUrl = this.retrieveBackgroundUrl();
    this.updateMobileNavigationView();
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    const hobbiesSection = document.getElementById("hobbies");
    if (!hobbiesSection) return;

    const hobbyItems = hobbiesSection.querySelectorAll(".hobby-item");

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(hobbyItems).indexOf(entry.target);
            if (index !== -1) {
              console.log(
                "Hobby item in view:",
                index + 1,
                this.hobbiesOrdered[index]?.title
              );
              this.currentPosition = index + 1;
              this.backgroundUrl = this.retrieveBackgroundUrl();
              this.updateMobileNavigationView();
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-30% 0px -30% 0px",
        threshold: 0.3,
      }
    );

    hobbyItems.forEach((item) => {
      this.intersectionObserver.observe(item);
    });
  }

  // Scroll detection for hobbies section changes
  @HostListener("window:scroll", ["$event"])
  onScroll(_event: any): void {
    const hobbiesSection = document.getElementById("hobbies");
    if (!hobbiesSection) return;

    const sectionTop = hobbiesSection.offsetTop;
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const viewportCenter = scrollTop + windowHeight / 2;

    // Check if hobbies section is in viewport for image switching
    const sectionBottom = sectionTop + hobbiesSection.offsetHeight;
    const sectionInView =
      scrollTop < sectionBottom && scrollTop + windowHeight > sectionTop;

    if (sectionInView) {
      const hobbyItems = hobbiesSection.querySelectorAll(".hobby-item");

      let activeIndex = -1;
      let minDistance = Infinity;

      hobbyItems.forEach((item: HTMLElement, index: number) => {
        const itemTop = sectionTop + index * windowHeight;
        const itemCenter = itemTop + windowHeight / 2;
        const distance = Math.abs(viewportCenter - itemCenter);

        // Find the item closest to the center
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      // Update current position if it has changed
      if (activeIndex !== -1 && this.currentPosition !== activeIndex + 1) {
        console.log(
          "Scroll detection - changing to hobby:",
          activeIndex + 1,
          this.hobbiesOrdered[activeIndex]?.title
        );
        this.currentPosition = activeIndex + 1;
        this.backgroundUrl = this.retrieveBackgroundUrl();
        this.updateMobileNavigationView();
      }
    }
  }

  private retrieveBackgroundUrl(): string {
    const currentItems = this.getCurrentItems();
    if (currentItems && currentItems.length > 0 && this.currentPosition > 0) {
      const url = currentItems[this.currentPosition - 1].backgroundUrl;
      console.log(
        "Retrieving background URL:",
        url,
        "for position:",
        this.currentPosition,
        "in tab:",
        this.activeMainTab
      );
      return url;
    }
    const fallbackUrl =
      currentItems && currentItems.length > 0
        ? currentItems[0].backgroundUrl
        : "";
    console.log("Using fallback URL:", fallbackUrl);
    return fallbackUrl;
  }

  private updateMobileNavigationView() {
    // Mobile navigation logic if needed
  }

  private preloadBounderyImages(urls: string[]) {
    // Preload images for better performance
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }

  setActiveMainTab(tab: string) {
    this.activeMainTab = tab;
    this.currentPosition = 1;
    this.backgroundUrl = this.retrieveBackgroundUrl();
    this.updateMobileNavigationView();
  }

  setActiveSubTab(position: number) {
    this.currentPosition = position;
    this.backgroundUrl = this.retrieveBackgroundUrl();
    this.updateMobileNavigationView();
  }

  getCurrentItems(): IHobby[] {
    return this.activeMainTab === "hobbies"
      ? this.hobbiesOrdered
      : this.extracurricularOrdered;
  }
}
