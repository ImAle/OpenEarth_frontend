import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {HouseService} from '../../core/services/house.service';
import {HouseCreation} from '../../core/models/houseCreation.model';
import {AutoComplete} from 'primeng/autocomplete';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'app-home-creation-form',
  imports: [
    ReactiveFormsModule,
    NgClass,
    AutoComplete,
    FormsModule,
    MapComponent
  ],
  templateUrl: './home-creation-form.component.html',
  styleUrl: './home-creation-form.component.css'
})
export class HomeCreationFormComponent implements OnInit {
  houseForm: FormGroup;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  isDragging: boolean = false;
  showDeleteButton: boolean[] = [];
  countries: string[] = [];
  categories: string[] = [];
  filteredCountries: string[] = [];
  filteredCategories: string[] = [];
  filteredCurrencies: string[] = [];
  currencies: string[] = ['EUR', 'USD', 'GBP'];

  constructor(private fb: FormBuilder, private houseService: HouseService) {
    this.houseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
      bedrooms: [1, [Validators.required, Validators.min(1)]],
      beds: [1, [Validators.required, Validators.min(1)]],
      bathrooms: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      currency: ['', Validators.required],
      country: ['', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.houseService.getCountries().subscribe((data:any) => {
      this.countries = data.countries;
    });
    this.houseService.getCategories().subscribe((data:any) => {
      this.categories = data.categories;
    })
  }

  searchCountries(event: any) {
    this.filteredCountries = this.countries.filter(c => c.toLowerCase().includes(event.query.toLowerCase()));
  }

  searchCategories(event: any){
    this.filteredCategories = this.categories.filter(c => c.toLowerCase().includes(event.query.toLowerCase()));
  }

  searchCurrency(event: any){
    this.filteredCurrencies = this.currencies.filter(c => c.toLowerCase().includes(event.query.toLowerCase()));
  }

  onCountrySelect(event: any) {
    this.houseForm.controls['country'].setValue(event.value);
  }

  onCategorySelect(event: any) {
    this.houseForm.controls['category'].setValue(event.value);
  }

  onCurrencySelect(event: any) {
    this.houseForm.controls['currency'].setValue(event.value);
  }

  onFileSelect(event: any) {
    this.handleFiles(event.target.files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  private handleFiles(files: FileList) {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        this.selectedFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onSubmit() {
    if (this.houseForm.valid) {
      const houseData = new HouseCreation(
        this.houseForm.value.title,
        this.houseForm.value.description,
        this.houseForm.value.guests,
        this.houseForm.value.bedrooms,
        this.houseForm.value.beds,
        this.houseForm.value.bathrooms,
        this.houseForm.value.price,
        this.houseForm.value.currency,
        this.houseForm.value.country,
        this.houseForm.value.location,
        this.houseForm.value.category
      );

      const formData = new FormData();
      formData.append('house', JSON.stringify(houseData)); // Convertir a JSON
      this.selectedFiles.forEach(file => formData.append('pictures', file, file.name));

      this.houseService.create(houseData, this.selectedFiles).subscribe({
        next: (response: any) => {
          console.log('House created:', response);
          alert('House created successfully!');
          this.houseForm.reset();
          this.selectedFiles = [];
        },
        error: (err: any) => {
          console.error('Error:', err);
          alert('Error creating house.');
        }
      });
    }
  }


}
