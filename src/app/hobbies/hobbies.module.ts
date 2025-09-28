import { NgModule } from "@angular/core";
import { HobbiesComponent } from "./hobbies.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [CommonModule, FontAwesomeModule, CoreModule, SharedModule],
  declarations: [HobbiesComponent],
  exports: [HobbiesComponent],
})
export class HobbiesModule {}
