import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Review } from '../../core/models/review.model';
import { HouseService } from '../../core/services/house.service';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit {
  @Input() review!: Review;
  @Input() currency!: string;
  houseName: string = '';

  constructor(private houseService: HouseService) {}

  ngOnInit(): void {
    if (this.review && this.review.houseId) {
      this.houseService.getById(this.review.houseId, this.currency).subscribe(house => {
        this.houseName = house.title;
      });
    }
  }
}
