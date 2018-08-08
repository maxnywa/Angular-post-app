import {Component, OnInit, ViewChild} from '@angular/core';
import { PostsService } from "../../services/posts.service";
import { Post } from "../../models/Post";
import {ToastrService} from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';
import {FormGroup} from "@angular/forms";
import {CommentsService} from "../../services/comments.service";
import {Comment} from "../../models/Comment";


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  @ViewChild ('form') form: FormGroup;
  posts: Post[];
  isAdmin = true;
  comment: Comment;

  constructor(
    public postService: PostsService,
    public commentService: CommentsService,
    public toastr: ToastrService,
    public spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();

      this.postService.getPosts().subscribe((posts:Post[]) =>{
        this.posts = posts;
      });

    setTimeout(()=>{
      this.spinner.hide();
    },500)
  }
  onDelete(id: number){
    this.postService.deletePost(id).subscribe((data:Object)=>{
      this.posts = this.posts.filter(post => post.id != id);

      this.toastr.success('Post deleted success', "Message")
    }, error =>{
      this.toastr.error(error.message, "Error")
    } );
  }
  onSubmit(form){
    if(form.invalid)return;

    let post:Post = {
      userId: 1,
      title: form.value.title ,
      body: form.value.text,
    };

    this.postService.addPost(post).subscribe((data)=>{
      let new_post:Post = data;
      this.posts.unshift(new_post);
      this.toastr.success('New post added', "Message")

    });
    form.resetForm();
  }

  onShowComment(id){
    this.posts.forEach(post =>{
      if(post.id === id){
        post.showComment = !post.showComment;
        if(post.showComment)this.showComment(id);
      }

    })
  }
  showComment(id){
    this.commentService.getComments().subscribe((comments:Comment[])=>{
      comments.forEach((item:Comment) =>{
        if(item.id === id)this.comment = item;
      })
    });
  }

}
