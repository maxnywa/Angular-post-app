import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { Post } from "../../models/Post";
import {PostsService} from "../../services/posts.service";


@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  @Input('post') postItem:Post;
  @Input('isAdmin') isAdmin;
  @Output () deletePost: EventEmitter<number> = new EventEmitter();
  @Output () showComment: EventEmitter<number> = new EventEmitter();
  @Output () editPost: EventEmitter<Post> = new EventEmitter();
  editPostId: number;

  constructor(
    public postService: PostsService,
  ) { }

  ngOnInit() {
    this.postService.editTaskEvent.subscribe((post:Post)=>{
      if(post.id === this.postItem.id){
        this.editPostId = post.id;
      }else{
        this.editPostId = 0;
      }
    });
  }

  onDelete(id:number){
    this.deletePost.emit(id);
  }
  onShowComment(id:number){
    this.showComment.emit(id);
  }
  onEdit(post: Post){
    const updatePost = {
      title: post.title,
      body: post.body,
      userId: post.userId,
      id: post.id
    };
    this.editPost.emit(updatePost);
  }
  onCancel(){
    this.editPost.emit({title:'',body:'', userId:1});
  }
}
