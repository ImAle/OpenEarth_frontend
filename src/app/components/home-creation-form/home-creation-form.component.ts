import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {HouseService} from '../../core/services/house.service';
import {HouseCreation} from '../../core/models/houseCreation.model';
import {AutoComplete} from 'primeng/autocomplete';
import {MapComponent} from '../map/map.component';
import {HeaderComponent} from '../header/header.component';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-home-creation-form',
  imports: [
    ReactiveFormsModule,
    NgClass,
    AutoComplete,
    FormsModule,
    MapComponent,
    HeaderComponent,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './home-creation-form.component.html',
  styleUrl: './home-creation-form.component.css'
})
export class HomeCreationFormComponent implements OnInit {
  houseForm!: FormGroup;
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
  coords: {latitude: number, longitude: number} | null = null;
  formErrors: { [key: string]: string } = {};
  isSubmitted = false;

  @ViewChild(MapComponent) mapComponent!: MapComponent;

  constructor(private fb: FormBuilder, private houseService: HouseService, private router: Router, private messageService: MessageService) {
    this.initForm();
  }

  private initForm(): void {
    this.houseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(65530)]],
      guests: [1, [Validators.required, Validators.min(1)]],
      bedrooms: [1, [Validators.required, Validators.min(0)]],
      beds: [1, [Validators.required, Validators.min(1)]],
      bathrooms: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      currency: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(6)]],
      category: ['', Validators.required],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    setTimeout(() => {
      this.mapComponent?.forceResize();
    }, 300);
  }

  private loadCategories(): void {
    this.houseService.getCategories().subscribe((data: any) => {
      this.categories = data.categories;
    });
  }

  // Map related methods
  onAddressReceived(event: any): void {
    this.houseForm.controls['location'].setValue(event.toString());
    this.validateControl('location');
  }

  setCoords(event: any): void {
    const latitude = event.lat;
    const longitude = event.lng;
    this.houseForm.controls['latitude'].setValue(latitude);
    this.houseForm.controls['longitude'].setValue(longitude);
    this.validateControl('latitude');
    this.validateControl('longitude');
  }

  // Autocomplete methods

  searchCategories(event: any): void {
    this.filteredCategories = this.categories.filter(c =>
      c.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  searchCurrency(event: any): void {
    this.filteredCurrencies = this.currencies.filter(c =>
      c.toLowerCase().includes(event.query.toLowerCase())
    );
  }

  onCategorySelect(event: any): void {
    this.houseForm.controls['category'].setValue(event.value);
    this.validateControl('category');
  }

  onCurrencySelect(event: any): void {
    this.houseForm.controls['currency'].setValue(event.value);
    this.validateControl('currency');
  }

  // File handling methods
  onFileSelect(event: any): void {
    this.handleFiles(event.target.files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  private handleFiles(files: FileList): void {
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
    // Clear image validation error if images are added
    if (this.selectedFiles.length > 0) {
      this.formErrors['images'] = '';
    }
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);

    // Re-add validation error if no images remain
    if (this.isSubmitted && this.selectedFiles.length === 0) {
      this.formErrors['images'] = 'At least one image is required';
    }
  }

  // Validation methods
  private validateControl(controlName: string): void {
    const control = this.houseForm.get(controlName);
    if (!control) return;

    this.formErrors[controlName] = '';

    if ((control.touched || this.isSubmitted) && control.errors) {
      if (control.errors['required']) {
        this.formErrors[controlName] = `${this.getControlLabel(controlName)} is required`;
      } else if (control.errors['minlength']) {
        const minLength = control.errors['minlength'].requiredLength;
        this.formErrors[controlName] = `${this.getControlLabel(controlName)} should be at least ${minLength} characters`;
      } else if (control.errors['maxlength']) {
        const maxLength = control.errors['maxlength'].requiredLength;
        this.formErrors[controlName] = `${this.getControlLabel(controlName)} should not exceed ${maxLength} characters`;
      } else if (control.errors['min']) {
        const min = control.errors['min'].min;
        this.formErrors[controlName] = `${this.getControlLabel(controlName)} should be at least ${min}`;
      }
    }
  }

  private getControlLabel(controlName: string): string {
    // Convert camelCase or snake_case to Title Case with spaces
    return controlName
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^\w/, c => c.toUpperCase());
  }

  private validateForm(): boolean {
    this.isSubmitted = true;
    this.formErrors = {};

    // Validate all form controls
    Object.keys(this.houseForm.controls).forEach(key => {
      this.validateControl(key);
    });

    // Validate images
    if (this.selectedFiles.length === 0) {
      this.formErrors['images'] = 'At least one image is required';
    }

    console.log("Valid: " + this.houseForm.valid);
    console.log("Length: " + Object.keys(this.formErrors).length);

    return this.houseForm.valid && Object.keys(this.formErrors).length === 0;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fix the errors in the form',
        key: "errorM"
      });

      Object.keys(this.houseForm.controls).forEach(key => {
        const control = this.houseForm.get(key);
        control?.markAsTouched();
        this.validateControl(key);
      });

    }

    const houseData = new HouseCreation(
      this.houseForm.value.title,
      this.houseForm.value.description,
      this.houseForm.value.guests,
      this.houseForm.value.bedrooms,
      this.houseForm.value.beds,
      this.houseForm.value.bathrooms,
      this.houseForm.value.price,
      this.houseForm.value.currency,
      this.houseForm.value.location,
      this.houseForm.value.category,
      this.houseForm.value.latitude,
      this.houseForm.value.longitude,
    );

    this.houseService.create(houseData, this.selectedFiles).subscribe({
      next: (response: any) => {
        console.log('House created:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Property registered successfully.',
          key: "successM"
        });
        this.houseForm.reset();
        this.selectedFiles = [];
        this.imagePreviews = [];
        this.router.navigate(["/home"]);
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Could not register this property.',
          key: "errorM"
        });
        console.error('Error:', err);
      }
    });
  }
}
