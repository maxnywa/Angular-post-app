import {Component, OnInit, ViewChild} from '@angular/core';
import { PostsService } from "../../services/posts.service";
import { Post } from "../../models/Post";
import {ToastrService} from "ngx-toastr";
import { NgxSpinnerService } from 'ngx-spinner';
import {CommentsService} from "../../services/comments.service";
import {Comment} from "../../models/Comment";


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[];
  isAdmin = true;
  comments: Comment[];


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
      },error =>{
          this.toastr.error(error.message, "Error")
        },()=>{
        this.spinner.hide();
      });
  }

  onDelete(id: number){
    this.spinner.show();

    this.postService.deletePost(id).subscribe((data:Object)=>{
      this.posts = this.posts.filter(post => post.id != id);
      this.toastr.success('Post deleted success', "Message")
    }, error =>{
      this.toastr.error(error.message, "Error")
    },()=>{
      this.spinner.hide();
    });
  }
  onShowComment(id:number){
    this.posts.forEach(post =>{
      if(post.id === id){
        this.comments = [];
        post.showComment = !post.showComment;
        if(post.showComment)this.showComment(id);
      }else{
        post.showComment = false;
      }
    })
  }
  showComment(id:number){
    this.commentService.getComments(id).subscribe((data) =>{
        this.comments = data;
      }, error =>{
      this.toastr.error(error.message, "Error")
    });
  }

  onAddNewPost(post){
    this.posts.unshift(post);
    this.toastr.success('New post added', "Message")
  }

  onEdit(post:Post){
    this.postService.emitEditEvent(post)
  }

  updatePost(post:Post){
    this.postService.editPost(post).subscribe((updatedPost:Post)=>{
      this.posts.forEach(post =>{
        if(post.id === updatedPost.id){
          Object.assign(post,updatedPost);
        }
      });
    });
    this.onEdit({title:'',body:'', userId:1});
  }
}
