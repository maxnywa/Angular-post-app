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
      },error =>{
          this.toastr.error(error.message, "Error")
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
    }, error =>{
      this.toastr.error(error.message, "Error")
    });
  }

  onAddNewPost(post){
    this.posts.unshift(post);
    this.toastr.success('New post added', "Message")
  }

}
