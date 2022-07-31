import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub = new Subscription();

  constructor(private http: HttpClient, private postService: PostService) { }
  

  ngOnInit() {
    //this.fetchPosts();
    this.errorSub = this.postService.error.subscribe(errorPost => this.error = errorPost);
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    console.log(postData);
    this.postService.createAndStorePost(postData);
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(
      () => this.loadedPosts = []
    );
  }

  private fetchPosts(){
    this.isFetching = true;
    this.postService.fetchsPost().subscribe(
      posts => {
        this.isFetching = false;
        this.loadedPosts = posts;
      }
    , (error: any) => {
      this.isFetching = false;
      this.error = error.message;
    });
  }

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

}
