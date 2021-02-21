import { Component, OnInit } from '@angular/core';
import { Todo } from '../../todo';
import { HttpClient } from '@angular/common/http';
import { BACKEND_BASE_DOMAIN } from 'src/environments/env'

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  public title = '';
  public todoList : Todo[];
  private httpClient: HttpClient;
  constructor(httpClient: HttpClient) { this.httpClient = httpClient; }

  ngOnInit(): void {
    this.httpClient.get<Todo[]>(BACKEND_BASE_DOMAIN)
    .subscribe(todoList => {
      this.todoList = todoList;
    });
  }

  onCreate(): void{
    if(this.title){
      this.httpClient.post<Todo>(
        BACKEND_BASE_DOMAIN,
        {
          title: this.title
        }
      ).subscribe(todo => {
        this.todoList.push(todo);
      });
      this.title = '';
    };
  };
  
  onComplete(todoOnComplete: Todo){
    this.httpClient.patch<Todo>(
      BACKEND_BASE_DOMAIN + todoOnComplete.id,
      {
        isCompleted: !todoOnComplete.isCompleted
      }
    ).subscribe( (updateTodo: Todo) => {
      this.todoList = this.todoList.map(todo => todo.id !== updateTodo.id ? todo: updateTodo);
  });
}

  onRemove(todoOnDelete: Todo){
    this.httpClient.delete<void>(
      BACKEND_BASE_DOMAIN + todoOnDelete.id).subscribe( () => {
        this.todoList = this.todoList.filter(todo => todo.id !== todoOnDelete.id)
    });
  };
}
