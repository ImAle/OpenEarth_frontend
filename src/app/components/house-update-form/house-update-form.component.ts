import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '../../core/services/house.service';
import { HouseUpdate } from '../../core/models/houseUpdate.model';
import { AutoComplete } from 'primeng/autocomplete';
import { HeaderComponent } from '../header/header.component';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { CurrencyService } from '../../core/services/currency.service';
import {environment} from '../../../environments/environment';
import {Picture} from '../../core/models/picture.model';
import {PictureService} from '../../core/services/picture.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-house-update-form',
  imports: [
    ReactiveFormsModule,
    NgClass,
    AutoComplete,
    FormsModule,
    HeaderComponent,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './house-update-form.component.html',
  styleUrl: './house-update-form.component.css'
})
export class HouseUpdateFormComponent implements OnInit {
  houseForm!: FormGroup;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  isDragging: boolean = false;
  showDeleteButton: boolean[] = [];
  categories: string[] = [];
  filteredCategories: string[] = [];
  filteredCurrencies: string[] = [];
  filteredStatuses: string[] = [];
  currencies!: string[];
  statuses: string[] = [];
  formErrors: { [key: string]: string } = {};
  isSubmitted = false;
  houseId: number = 0;
  currency: string = 'EUR';
  pictures: Picture[] = [];
  pictureIdsToDelete: number[] = [];
  originalPictureCount: number = 0;

  // Step management properties
  currentStep: number = 1;
  totalSteps: number = 3;

  constructor(
    private fb: FormBuilder,
    private houseService: HouseService,
    private currencyService: CurrencyService,
    private pictureService: PictureService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.initForm();
    this.currencies = this.currencyService.getAllCurrenciesCode();
  }

  private initForm(): void {
    this.houseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(65530)]],
      guests: [1, [Validators.required, Validators.min(1)]],
      bedrooms: [0, [Validators.required, Validators.min(0)]],
      beds: [1, [Validators.required, Validators.min(1)]],
      bathrooms: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      currency: ['', Validators.required],
      category: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadStatuses();
    this.currency = this.currencyService.current().code;

    // Get house ID from route param
    this.route.params.subscribe(params => {
      this.houseId = +params['id'];
      this.loadHouseData(this.houseId);
    });
  }

  private loadHouseData(id: number): void {
    this.houseService.getById(id, this.currency).subscribe({
      next: (response: any) => {
        let house = response.house;

        this.houseForm.patchValue({
          title: house.title,
          description: house.description,
          guests: house.guests,
          bedrooms: house.bedrooms,
          beds: house.beds,
          bathrooms: house.bathrooms,
          price: house.price,
          currency: house.currency,
          category: house.category,
          status: house.status
        });

        // Load existing images if available
        if (house.pictures && house.pictures.length > 0) {

          // Properly populate the pictures array with Picture objects
          this.pictures = [];
          house.pictures.forEach((pic: any) => {
            this.pictures.push(new Picture(pic.id, pic.url));
            this.imagePreviews.push(environment.imgUrl + pic.url);
          });

          this.originalPictureCount = house.pictures.length;
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load house data',
          key: "errorM"
        });
        console.error('Error:', err);
      }
    });
  }

  // Step management methods
  getStepName(step: number): string {
    switch(step) {
      case 1: return 'Basic Info';
      case 2: return 'Capacity';
      case 3: return 'Pricing & Photos';
      default: return '';
    }
  }

  validateCurrentStep(): boolean {
    const controls = {
      1: ['title', 'description', 'category', 'status'],
      2: ['guests', 'bedrooms', 'beds', 'bathrooms'],
      3: ['price', 'currency']
    };

    let isValid = true;
    const currentControls = controls[this.currentStep as keyof typeof controls];

    currentControls.forEach(controlName => {
      const control = this.houseForm.get(controlName);
      if (control && !control.valid) {
        control.markAsTouched();
        this.validateControl(controlName);
        isValid = false;
      }
    });

    if (!isValid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please complete all required fields',
        key: "errorM"
      });
    }

    return isValid;
  }

  goToNextStep(): void {
    if (this.validateCurrentStep() && this.currentStep < this.totalSteps) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  private loadCategories(): void {
    this.houseService.getCategories().subscribe((response: any) => {
      this.categories = response.categories;
      this.categories = this.categories.map(category => category.replace("_", " "));
    });
  }

  private loadStatuses(): void {
    this.houseService.getStatuses().subscribe((response: any) => {
      this.statuses = response.statuses || [];
    });
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

  searchStatuses(event: any): void {
    this.filteredStatuses = this.statuses.filter(s =>
      s.toLowerCase().includes(event.query.toLowerCase())
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

  onStatusSelect(event: any): void {
    this.houseForm.controls['status'].setValue(event.value);
    this.validateControl('status');
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
  }

  removeImage(index: number): void {

    // Check if the image is from existing pictures or newly added files
    if (index < this.pictures.length) {
      // It's an existing image - add its ID to the list for deletion
      const pictureId = this.pictures[index]?.id;

      if (pictureId !== undefined) {
        this.pictureIdsToDelete.push(pictureId);
      }

      // Remove from pictures array
      this.pictures.splice(index, 1);
    } else {
      // It's a new image - adjust index to access selectedFiles correctly
      const newFileIndex = index - this.pictures.length;
      if (newFileIndex >= 0 && newFileIndex < this.selectedFiles.length) {
        this.selectedFiles.splice(newFileIndex, 1);
      }
    }

    // Remove from preview regardless
    this.imagePreviews.splice(index, 1);
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
    let formIsValid = true;

    // Validate all form controls
    Object.keys(this.houseForm.controls).forEach(key => {
      const control = this.houseForm.get(key);
      if (control && control.invalid) {
        formIsValid = false;
        this.validateControl(key);
      }
    });

    return formIsValid && this.houseForm.valid;
  }

  onSubmit(): void {
    // Final validation of the entire form before submission
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
      return;
    }

    // If there are images to delete, process them first
    if (this.pictureIdsToDelete.length > 0) {
      this.deleteSelectedImages();
    } else {
      // No images to delete, proceed directly to updating the house
      this.updateHouse();
    }
  }

  private deleteSelectedImages(): void {
    // Create an array of observables for each delete operation
    const deleteObservables = this.pictureIdsToDelete.map(id =>
      this.pictureService.delete(id).pipe(
        catchError(error => {
          console.error(`Error deleting image with ID ${id}:`, error);
          return of(null); // Continue with the next deletion even if this one fails
        })
      )
    );

    // Execute all delete operations in parallel
    forkJoin(deleteObservables).subscribe({
      next: () => {
        // All images deleted (or deletion attempts made), now update the house
        this.updateHouse();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete some images. Please try again.',
          key: "errorM"
        });
        console.error('Error deleting images:', err);
      }
    });
  }

  private updateHouse(): void {
    const houseData = new HouseUpdate(
      this.houseForm.value.title,
      this.houseForm.value.description,
      this.houseForm.value.guests,
      this.houseForm.value.bedrooms,
      this.houseForm.value.beds,
      this.houseForm.value.bathrooms,
      this.houseForm.value.price,
      this.houseForm.value.currency,
      this.houseForm.value.category,
      this.houseForm.value.status
    );

    this.houseService.update(this.houseId, houseData, this.selectedFiles).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Property updated successfully.',
          key: "successM"
        });
        this.router.navigate(["/house", this.houseId]);
      },
      error: (err: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Could not update this property.',
          key: "errorM"
        });
        console.error('Error:', err);
      }
    });
  }
}
