import {Component, OnInit} from '@angular/core';
import {UserService} from '../../core/services/user.service';
import {User} from '../../core/models/user.model';

@Component({
  selector: 'app-user-table',
  imports: [],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.css'
})
export class UserTableComponent implements OnInit {
  users!: User[];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll(){
    this.userService.getAllUsers().subscribe({
      next: (data:any) => {
        this.users = data.users;
      }, err: (error : any) => {
        console.log(error);
      }
    });
  }


}
