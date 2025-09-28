import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FloatingElementsComponent } from "../experience/floating-elements.component";

@NgModule({
  imports: [CommonModule],
  declarations: [FloatingElementsComponent],
  exports: [FloatingElementsComponent],
})
export class SharedModule {}
