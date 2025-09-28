import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ResumeComponent } from "../resume/resume.component";
import { HeaderComponent } from "../header/header.component";
import { AboutComponent } from "../about/about.component";
import { ContactComponent } from "../contact/contact.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ExperienceModule } from "../experience/experience.module";
import { CoreModule } from "../core/core.module";
import { PostsModule } from "../posts/posts.molule";
import { HobbiesModule } from "../hobbies/hobbies.module";

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CoreModule,
    FontAwesomeModule,
    ExperienceModule,
    PostsModule,
    HobbiesModule,
  ],
  declarations: [
    ResumeComponent,
    HeaderComponent,
    AboutComponent,
    ContactComponent,
  ],
  exports: [ResumeComponent],
  providers: [],
})
export class ResumeModule {}
