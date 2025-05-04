import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Review } from '../../core/models/review.model';
import { HouseService } from '../../core/services/house.service';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { UserService } from '../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    AvatarModule,
    RatingModule,
    FormsModule
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {
  @Input() review!: Review;
  @Input() currency!: string;
  username: string = '';
  userPicture: string = '';
  userId!: number;

  constructor(private houseService: HouseService, private userService: UserService) {}

  ngOnInit(): void {
    if (this.review) {
      this.userService.getUser(this.review.userId).subscribe({
        next: (response) => {
          const user = response.user;
          this.username = user.username;
          this.userPicture = environment.imgUrl + user.picture;
          this.userId = user.id;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
