import { Component, OnInit } from '@angular/core';
import { Todo } from '../../todo';
import { HttpClient } from '@angular/common/http';
import { BACKEND_BASE_DOMAIN } from 'src/environments/env';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  
  todo = [
    'Get to work',
    'Pick up groceries',
    'Brush teeth',
    'Take a shower',
    'Buy eggs'
  ];

  processed = [
    'Saw thing',
    'Hit the gym',
    'Read a book'
  ];

  done = [
    'Get up',
    'Pay bills'
  ];

  public title = '';
  public todoList : Todo[];
  private httpClient: HttpClient;
  constructor(httpClient: HttpClient) { this.httpClient = httpClient; }

  ngOnInit(): void {
    this.httpClient.get<Todo[]>(BACKEND_BASE_DOMAIN)
    .subscribe(todoList => {
      this.todoList = todoList;
    });
  };

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    };
  };

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
};

  onRemove(todoOnDelete: Todo){
    this.httpClient.delete<void>(
      BACKEND_BASE_DOMAIN + todoOnDelete.id).subscribe( () => {
        this.todoList = this.todoList.filter(todo => todo.id !== todoOnDelete.id)
    });
  };
};