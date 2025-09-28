import { Component, OnInit } from "@angular/core";
import { DataService } from "../core/data.service";
import { IPost } from "./posts-interfaces";
import { AbstractSwipeSection } from "../core/shared/abstract.swipe.section";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.scss", "./posts.component.responsivity.scss"],
})
export class PostsComponent extends AbstractSwipeSection implements OnInit {
  posts: IPost[] = [];

  constructor(private dataService: DataService) {
    super();
  }

  ngOnInit(): void {
    // Fetch the Posts from the Data Service
    this.dataService.getPosts().subscribe((posts: IPost[]) => {
      this.posts = posts;
    });
  }

  // Required methods from AbstractSwipeSection
  public disablePreviousNavigation(): boolean {
    return false; // Not used in this component
  }

  public disableNextNavigation(): boolean {
    return false; // Not used in this component
  }

  public onClickPrevious(): void {
    // Not used in this component
  }

  public onClickNext(): void {
    // Not used in this component
  }

  sharePost(post: IPost): void {
    // Get the first internationalization for title and description
    const firstIntl = post.internationalizations?.[0];
    const title = firstIntl?.title || "Blog Post";
    const description = firstIntl?.description || "";

    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: post.http,
      });
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(post.http);
    }
  }
}
