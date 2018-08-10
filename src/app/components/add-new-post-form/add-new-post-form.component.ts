import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms'
import { Post } from "../../models/Post";
import { PostsService } from "../../services/posts.service";
import {ToastrService} from "ngx-toastr";




@Component({
  selector: 'app-add-new-post-form',
  templateUrl: './add-new-post-form.component.html',
  styleUrls: ['./add-new-post-form.component.css']
})
export class AddNewPostFormComponent implements OnInit {
  @Output() onAddNewPost: EventEmitter<Post> = new EventEmitter();
  @Input ('posts')posts:Post[];

  formData:Post = {
    title: '',
    body: '',
    userId:1,
  };

  constructor(
    public postService: PostsService,
    public toastr: ToastrService,

  ) { }

  ngOnInit() {
    this.postService.editTaskEvent.subscribe((post:Post)=>{
      console.log('edit',post);
      this.formData = post;
    })
  }

  onAddPost(form){
    if(form.invalid)return;

    let post:Post = {
      userId: this.formData.userId,
      title: this.formData.title ,
      body: this.formData.body,
    };

    this.postService.addPost(post).subscribe((data:Post)=>{
      if (data.id){
        this.onAddNewPost.emit(data)
      }

    });

    form.resetForm();
  }
  onCancel(){
    this.postService.emitEditEvent({title:'',body:'', userId:1});
  }


}
