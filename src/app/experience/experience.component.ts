import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
  ViewChild,
  HostListener,
} from "@angular/core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { IExperience } from "./experience-interfaces";
import { DataService } from "../core/data.service";
import { SorterService } from "../core/sorter.service";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { AbstractSwipeSection } from "../core/shared/abstract.swipe.section";

@Component({
  selector: "app-experience",
  templateUrl: "./experience.component.html",
  styleUrls: [
    "./experience.component.scss",
    "experience-component.reponsivity.scss",
  ],
})
export class ExperienceComponent
  extends AbstractSwipeSection
  implements OnInit, OnDestroy
{
  SELECTED_CLASS: string = "selected";
  LEAVE_RIGHT_CLASS: string = "leave-right";
  ENTER_RIGHT_CLASS: string = "enter-right";
  LEAVE_LEFT_CLASS: string = "leave-left";
  ENTER_LEFT_CLASS: string = "enter-left";
  TRANSITION_TIME: number = 400;

  experiences: IExperience[];
  experiencesOrdered: IExperience[] = [];
  currentPosition: number;
  backgroundUrl: string;

  previousYear: string;
  currentYear: string;
  nextYear: string;

  @ViewChild("orderedList") orderedList: ElementRef;
  @ViewChild("experienceCards") experienceCards: ElementRef;
  @ViewChild("scrollContainer") scrollContainer: ElementRef;
  @ViewChild("contentScrollContainer") contentScrollContainer: ElementRef;

  private intersectionObserver: IntersectionObserver;

  constructor(
    private dataService: DataService,
    private sortService: SorterService,
    private renderer: Renderer2,
    private library: FaIconLibrary
  ) {
    super();
    library.addIconPacks(fas, fab);
  }

  ngOnInit(): void {
    // Fetch the Experiences from the Data Service
    this.dataService
      .getExperiences()
      .subscribe((experiences: IExperience[]) => {
        this.currentPosition = experiences.length;
        this.experiences = experiences;

        this.experiencesOrdered = [...experiences];
        this.experiencesOrdered.sort(this.sortService.sort("position", "desc"));
        this.backgroundUrl = this.retrieveBackgroundUrl();
        this.updateMobileNavigationView();
        this.preloadBounderyImages(experiences.map((xp) => xp.backgroundUrl));

        // Set CSS variable for experience count to ensure proper height
        document.documentElement.style.setProperty(
          "--experience-count",
          experiences.length.toString()
        );

        // Initialize scroll detection after a short delay to ensure DOM is ready
        setTimeout(() => {
          this.setupIntersectionObserver();
        }, 100);
      });
  }

  public disablePreviousNavigation(): boolean {
    return this.currentPosition === 1;
  }

  public disableNextNavigation(): boolean {
    return this.currentPosition === this.experiencesOrdered?.length;
  }

  // Preloads the boundaries images related to the current position in order to avoid the "blinking" of the background while navigating.
  private preloadBounderyImages(images: string[]) {
    images.forEach(function (image, i) {
      const preloadImages = new Array();
      preloadImages[i] = new Image();
      preloadImages[i].src = image;
    });
  }

  private createListSelector(position: number): string {
    return `li[id="${position}"]`;
  }

  onClickPrevious(targetPos?: number): void {
    const currElem = this.orderedList.nativeElement.querySelector(
      this.createListSelector(this.currentPosition)
    );
    this.renderer.removeClass(currElem, this.SELECTED_CLASS);
    this.renderer.addClass(currElem, this.LEAVE_RIGHT_CLASS);

    setTimeout(() => {
      this.renderer.removeClass(currElem, this.LEAVE_RIGHT_CLASS);
    }, this.TRANSITION_TIME);

    // Subtracts one to the current position in order to move backwards in the timeline.
    this.currentPosition = targetPos ? +targetPos : this.currentPosition - 1;
    this.backgroundUrl = this.retrieveBackgroundUrl();

    const targetElem = this.orderedList.nativeElement.querySelector(
      this.createListSelector(this.currentPosition)
    );
    this.renderer.addClass(targetElem, this.SELECTED_CLASS);
    this.renderer.addClass(targetElem, this.ENTER_LEFT_CLASS);

    setTimeout(() => {
      this.renderer.removeClass(targetElem, this.ENTER_LEFT_CLASS);
    }, this.TRANSITION_TIME);

    this.updateMobileNavigationView();
  }

  onClickNext(targetPos?: number): void {
    const currElem = this.orderedList.nativeElement.querySelector(
      this.createListSelector(this.currentPosition)
    );
    this.renderer.removeClass(currElem, this.SELECTED_CLASS);
    this.renderer.addClass(currElem, this.LEAVE_LEFT_CLASS);

    setTimeout(() => {
      this.renderer.removeClass(currElem, this.LEAVE_LEFT_CLASS);
    }, this.TRANSITION_TIME);

    // Sums one to the current position in order to move further in the timeline.
    this.currentPosition = targetPos ? +targetPos : this.currentPosition + 1;
    this.backgroundUrl = this.retrieveBackgroundUrl();

    const targetElem = this.orderedList.nativeElement.querySelector(
      this.createListSelector(this.currentPosition)
    );
    this.renderer.addClass(targetElem, this.SELECTED_CLASS);
    this.renderer.addClass(targetElem, this.ENTER_RIGHT_CLASS);

    setTimeout(() => {
      this.renderer.removeClass(targetElem, this.ENTER_RIGHT_CLASS);
    }, this.TRANSITION_TIME);

    this.updateMobileNavigationView();
  }

  updateNavigation(targetPos: number) {
    // in case of == nothing to do here
    if (targetPos > this.currentPosition) {
      this.onClickNext(targetPos);
    } else if (targetPos < this.currentPosition) {
      this.onClickPrevious(targetPos);
    }
  }

  private retrieveBackgroundUrl(): string {
    if (
      this.experiences &&
      this.experiences.length > 0 &&
      this.currentPosition > 0
    ) {
      return this.experiences[this.currentPosition - 1].backgroundUrl;
    }
    return this.experiencesOrdered && this.experiencesOrdered.length > 0
      ? this.experiencesOrdered[0].backgroundUrl
      : "";
  }

  private updateMobileNavigationView() {
    this.previousYear =
      this.experiences[this.currentPosition - 2]?.startAt ||
      this.experiences[this.currentPosition - 1].startAt;
    this.currentYear = this.experiences[this.currentPosition - 1].startAt;
    this.nextYear =
      this.experiences[this.currentPosition]?.startAt ||
      this.experiences[this.currentPosition - 1].startAt;
  }

  // Retool-style experience selection
  setCurrentExperience(position: number): void {
    this.currentPosition = position;
    this.backgroundUrl = this.retrieveBackgroundUrl();
    this.updateMobileNavigationView();
  }

  private scrollToActiveCard(): void {
    if (this.scrollContainer) {
      const container = this.scrollContainer.nativeElement;
      const activeCard = container.querySelector(".experience-card.active");
      if (activeCard) {
        activeCard.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  // Setup intersection observer for better scroll detection
  private setupIntersectionObserver(): void {
    const experienceSection = document.getElementById("experience");
    if (!experienceSection) return;

    const experienceItems =
      experienceSection.querySelectorAll(".experience-item");

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(experienceItems).indexOf(entry.target);
            if (index !== -1 && this.currentPosition !== index + 1) {
              this.currentPosition = index + 1;
              this.backgroundUrl = this.retrieveBackgroundUrl();
              this.updateMobileNavigationView();
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.5,
      }
    );

    experienceItems.forEach((item) => {
      this.intersectionObserver.observe(item);
    });
  }

  // Helper method to get location text
  getLocationText(exp: IExperience, property: string): string {
    if (!exp.internationalizations || exp.internationalizations.length === 0) {
      return "Loading...";
    }

    // Try to find English first, then any available language
    const englishData = exp.internationalizations.find(
      (item) => item.language === "en"
    );
    const data = englishData || exp.internationalizations[0];

    return data[property] || "Loading...";
  }

  // Method to calculate scroll-based zoom scale
  getScrollZoomScale(): number {
    const experienceSection = document.getElementById("experience");
    if (!experienceSection) return 1;

    const sectionTop = experienceSection.offsetTop;
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const viewportCenter = scrollTop + windowHeight / 2;

    // Calculate which experience item is currently in the center
    const experienceItems =
      experienceSection.querySelectorAll(".experience-item");
    let activeIndex = -1;
    let minDistance = Infinity;

    experienceItems.forEach((item: HTMLElement, index: number) => {
      const itemTop = sectionTop + index * windowHeight;
      const itemCenter = itemTop + windowHeight / 2;
      const distance = Math.abs(viewportCenter - itemCenter);

      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    if (activeIndex === -1) return 1;

    // Calculate zoom based on how centered the current experience is
    const itemTop = sectionTop + activeIndex * windowHeight;
    const itemCenter = itemTop + windowHeight / 2;
    const distanceFromCenter = Math.abs(viewportCenter - itemCenter);

    // Normalize distance (0 = perfectly centered, 1 = at edge)
    const normalizedDistance = Math.min(
      1,
      distanceFromCenter / (windowHeight / 2)
    );

    // Zoom scale: 1.2x when centered, 0.8x when at edges
    const zoomScale = 1.2 - 0.4 * normalizedDistance;

    return Math.max(0.7, Math.min(1.3, zoomScale));
  }

  // Scroll detection for experience section changes
  @HostListener("window:scroll", ["$event"])
  onScroll(_event: any): void {
    const experienceSection = document.getElementById("experience");
    if (!experienceSection) return;

    const sectionTop = experienceSection.offsetTop;
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const viewportCenter = scrollTop + windowHeight / 2;

    // Check if experience section is in viewport
    const sectionInView =
      viewportCenter >= sectionTop &&
      viewportCenter <= sectionTop + experienceSection.offsetHeight;

    // Show/hide the fixed image based on section visibility
    const imageSide = document.querySelector(".image-side") as HTMLElement;
    if (imageSide) {
      if (sectionInView) {
        imageSide.style.display = "flex";

        // Apply scroll-based zoom effect
        const zoomScale = this.getScrollZoomScale();
        const experienceImage = document.querySelector(
          ".experience-image"
        ) as HTMLElement;
        if (experienceImage) {
          experienceImage.style.setProperty(
            "--scroll-zoom-scale",
            zoomScale.toString()
          );
        }
      } else {
        imageSide.style.display = "none";
      }
    }

    if (sectionInView) {
      const experienceItems =
        experienceSection.querySelectorAll(".experience-item");

      let activeIndex = -1;
      let minDistance = Infinity;

      experienceItems.forEach((item: HTMLElement, index: number) => {
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
        this.currentPosition = activeIndex + 1;
        this.backgroundUrl = this.retrieveBackgroundUrl();
        this.updateMobileNavigationView();
      }
    }
  }
}
