import {Component, effect, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {HeaderComponent} from '../header/header.component';
import {HousePreview} from '../../core/models/housePreview.model';
import {Rent} from '../../core/models/rent.model';
import {HouseService} from '../../core/services/house.service';
import {RentService} from '../../core/services/rent.service';
import {DatePipe, NgClass, UpperCasePipe} from '@angular/common';
import {CardComponent} from '../card/card.component';
import {UserService} from '../../core/services/user.service';
import {User} from '../../core/models/user.model';
import {CurrencyService} from '../../core/services/currency.service';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-user-config',
  imports: [
    HeaderComponent,
    DatePipe,
    CardComponent,
    Toast,
    RouterLink,
    NgClass,
    UpperCasePipe
  ],
  providers: [MessageService],
  templateUrl: './user-config.component.html',
  styleUrl: './user-config.component.css'
})
export class UserConfigComponent implements OnInit{
  currency : string = "EUR";
  userRole: string | null = null;
  houses: HousePreview[] = [];
  rents: Rent[] = [];
  userId: number | null = null;
  userProfile: User | null = null;
  userProfilePicUrl: string = '/defaultUser.jpg';
  isLoading = true;
  selectedHouse: HousePreview | null = null;
  showModal = false;
  confirmDelete = false;
  isFirstLoad = false;
  houseIdNameMap: Map<number, string> = new Map();

  constructor(
    private authService: AuthService,
    private houseService: HouseService,
    private rentService: RentService,
    private userService: UserService,
    private currencyService: CurrencyService,
    private messageService: MessageService,
    private router: Router
  ) {
    effect(() => {
      // Get the current currency from the store signal
      this.currency = this.currencyService.current().code;
      // Refetch houses with the new currency
      if (this.currency) {
        this.loadHouses(this.currency);
      }
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = this.authService.getMyId();

    this.userService.getProfile().subscribe({
      next: (response: any) => {
        console.log(response.user);
        this.userProfile = response.user;
        this.userProfilePicUrl = response.user.picture ? environment.rootUrl + response.user.picture : '/defaultUser.jpg';

      }, error: (error: any) => {
        console.error("Error fetching user:" + error);
      }
    });

    // Get user role
    this.authService.getRole().subscribe({
      next: (response) => {
        this.userRole = response.role;

        // If user is HOSTESS, load their houses
        if (this.userRole === 'HOSTESS') {
          this.loadHouses(this.currency);
          this.getRentsOfMyHouses();
        }
        // If user is GUEST, load their rents
        else if (this.userRole === 'GUEST') {
          this.loadRents();
        }

        this.isLoading = false;
        this.isFirstLoad = true;

        setTimeout(() => {
          this.isFirstLoad = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error fetching user role:', error);
        this.isLoading = false;
      }
    });
  }

  loadHouses(currency: string): void {
    if (this.userId) {
      this.houseService.getHousesByOwner(this.userId, currency).subscribe({
        next: (response: any) => {
          this.houses = response.houses;
        },
        error: (error) => {
          console.error('Error loading houses:', error);
        }
      });
    }
  }

  // If guest
  loadRents(): void {
    this.rentService.getMyRents().subscribe({
      next: (response: any) => {
        this.rents = response.rents;
        this.getHousesRentName();
      },
      error: (error) => {
        console.error('Error loading rents:', error);
      }
    });
  }

  // if Hostess
  getRentsOfMyHouses() {
    this.rentService.getRentsOfMyHouses().subscribe({
      next: (response: any) => {
        console.log(response);
        this.rents = response.rents;
        if(this.rents) {
          this.getHousesRentName();
        }
      },
      error: (error: any) => {
        console.log(error);
        console.error('Error loading rents:', error);
      }
    })
  }

  getHousesRentName(){
    this.rents.forEach(rent => {
      this.houseService.getById(rent.houseId, this.currency).subscribe({
        next: (response: any)=> {
          this.houseIdNameMap.set(rent.houseId, response.house.title);
        }, error: (error: any) => {
          console.log(error);
        }
      })
    });
  }

  changeProfilePicture(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.userService.update(file).subscribe({
        next: (response: any) => {
          this.messageService.add(
            {
              severity: 'success',
              key: 'success',
              summary: 'Profile picture updated!',
              detail: 'Your profile picture has been updated successfully.'}
          );
        },
        error: (error) => {
          console.error('Error updating profile picture:', error);
        }
      })
    }
  }

  openHouseModal(house: HousePreview): void {
    this.selectedHouse = house;
    this.showModal = true;
    this.confirmDelete = false;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedHouse = null;
    this.confirmDelete = false;
  }

  viewHouse(): void {
    if (this.selectedHouse) {
      this.router.navigate(['/house', this.selectedHouse.id]);
      this.closeModal();
    }
  }

  updateHouse(): void {
    if (this.selectedHouse) {
      this.router.navigate(['/updateHouse', this.selectedHouse.id]);
      this.closeModal();
    }
  }

  confirmDeleteHouse(): void {
    this.confirmDelete = true;
  }

  deleteHouse(): void {
    if (this.selectedHouse) {
      this.houseService.delete(this.selectedHouse.id).subscribe({
        next: () => {
          // Remove house from the list
          this.houses = this.houses.filter(h => h.id !== this.selectedHouse?.id);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error deleting house:', error);
        }
      });
    }
  }

  navigateToCreateHouse(): void {
    this.router.navigate(['/registerHouse']);
  }

  getRentStatus(rent: Rent): 'pending'|'active'|'completed' {
    const now = new Date();
    const start = new Date(rent.startTime);
    const end   = new Date(rent.endTime);
    if (now < start)   return 'pending';
    if (now > end)     return 'completed';
    return 'active';
  }

  getBadgeClass(status: 'pending'|'active'|'completed'): string {
    switch (status) {
      case 'pending':   return 'bg-warning text-dark';
      case 'active':    return 'bg-success';
      case 'completed': return 'bg-secondary';
    }
  }
}
