import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CurrencyService} from '../../core/services/currency.service';
import {Currency} from '../../core/models/currency.model';

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.css'
})
export class CurrencyComponent {
  isDropdownOpen = false;

  constructor(private currencyService: CurrencyService) {}

  // Helper getters to access data from the service
  get selectedCurrency() {
    return this.currencyService.current;
  }

  get continentOrder() {
    return this.currencyService.getContinentOrder();
  }

  get currenciesByContinent() {
    return this.currencyService.getContinentsWithCurrencies();
  }

  // UI methods
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  selectCurrency(currency: Currency) {
    this.currencyService.setCurrentCurrency(currency);
    this.closeDropdown();
  }
}
