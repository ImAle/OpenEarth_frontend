import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HouseService} from '../../core/services/house.service';

@Component({
  selector: 'app-filter',
  imports: [],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent implements OnInit{
  categories!: string[];
  minPrice: number|null = null;
  maxPrice: number|null = null;
  beds: number|null = null;
  guests: number|null = null;
  selectedCategory: string|null = null;

  constructor(private houseService: HouseService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  onCategorySelected(event: Event) {
    //this.selectedCategory = event;
  }

  getCategories(){
    this.houseService.getCategories().subscribe({
      next: (response) => {
        if(response){
          this.categories = response.categories;
        }
      }, error: (err: Error) => {
        console.log(err);
      }
    });
  }

  scrollRight() {
    const container = document.getElementById('categoryScroll');
    if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
  }

  scrollLeft() {
    const container = document.getElementById('categoryScroll');
    if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
  }


}
