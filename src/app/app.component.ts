import { Component, OnInit } from '@angular/core';
import { TodoListComponent } from 'src/app/components/todo-list/todo-list.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  public title = '';
  
  ngOnInit(): void{ }
}
