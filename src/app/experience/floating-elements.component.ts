import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Renderer2,
} from "@angular/core";

@Component({
  selector: "app-floating-elements",
  template: `
    <div class="floating-elements">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>
      <div class="floating-square square-1"></div>
      <div class="floating-square square-2"></div>
    </div>
  `,
  styles: [
    `
      .floating-elements {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        overflow: hidden;
      }

      .floating-circle {
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.03) 0%,
          rgba(255, 255, 255, 0.01) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.05);
        animation: float 20s infinite linear;
      }

      .circle-1 {
        width: 120px;
        height: 120px;
        top: 20%;
        left: 10%;
        animation-delay: 0s;
      }

      .circle-2 {
        width: 80px;
        height: 80px;
        top: 60%;
        right: 15%;
        animation-delay: -7s;
      }

      .circle-3 {
        width: 60px;
        height: 60px;
        top: 80%;
        left: 20%;
        animation-delay: -14s;
      }

      .floating-square {
        position: absolute;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.02) 0%,
          rgba(255, 255, 255, 0.005) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.03);
        animation: float 25s infinite linear reverse;
      }

      .square-1 {
        width: 100px;
        height: 100px;
        top: 30%;
        right: 20%;
        transform: rotate(45deg);
        animation-delay: -5s;
      }

      .square-2 {
        width: 60px;
        height: 60px;
        top: 70%;
        left: 5%;
        transform: rotate(45deg);
        animation-delay: -12s;
      }

      @keyframes float {
        0% {
          transform: translateY(0px) rotate(0deg);
          opacity: 0.3;
        }
        50% {
          transform: translateY(-20px) rotate(180deg);
          opacity: 0.6;
        }
        100% {
          transform: translateY(0px) rotate(360deg);
          opacity: 0.3;
        }
      }
    `,
  ],
})
export class FloatingElementsComponent implements OnInit, OnDestroy {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Add random movement to elements
    this.addRandomMovement();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private addRandomMovement(): void {
    const elements = this.el.nativeElement.querySelectorAll(
      ".floating-circle, .floating-square"
    );

    elements.forEach((element: HTMLElement, _index: number) => {
      const randomDelay = Math.random() * 10;
      const randomDuration = 15 + Math.random() * 20;

      this.renderer.setStyle(element, "animation-delay", `-${randomDelay}s`);
      this.renderer.setStyle(
        element,
        "animation-duration",
        `${randomDuration}s`
      );
    });
  }
}
