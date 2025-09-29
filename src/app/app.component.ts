import { Component, OnInit } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title: string = "Live Resume - Krishna Patil";

  constructor(private titleService: Title, private metaTagService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);

    this.metaTagService.addTags([
      {
        name: "keywords",
        content: "CA, MBA",
      },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Krishna Patil" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "date", content: "2020-05-12", scheme: "YYYY-MM-DD" },
      { charset: "UTF-8" },
    ]);

    this.metaTagService.updateTag({
      name: "description",
      content: "Hello, I'm a CA, MBA",
    });
  }
}
