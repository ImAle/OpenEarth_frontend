import { Injectable, signal } from '@angular/core';
import { Currency } from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private currentCurrency = signal<Currency>({
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    continent: 'Europe'
  });

  private currencies: Currency[] = [
    // Europe
    { code: 'EUR', name: 'Euro', symbol: '€', continent: 'Europe' },
    { code: 'GBP', name: 'British Pound', symbol: '£', continent: 'Europe' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', continent: 'Europe' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', continent: 'Europe' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', continent: 'Europe' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', continent: 'Europe' },
    { code: 'PLN', name: 'Polish Złoty', symbol: 'zł', continent: 'Europe' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', continent: 'Europe' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', continent: 'Europe' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei', continent: 'Europe' },

    // North America
    { code: 'USD', name: 'US Dollar', symbol: '$', continent: 'North America' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', continent: 'North America' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', continent: 'North America' },

    // South America
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', continent: 'South America' },
    { code: 'ARS', name: 'Argentine Peso', symbol: '$', continent: 'South America' },
    { code: 'CLP', name: 'Chilean Peso', symbol: '$', continent: 'South America' },
    { code: 'COP', name: 'Colombian Peso', symbol: '$', continent: 'South America' },
    { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', continent: 'South America' },

    // Asia
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', continent: 'Asia' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', continent: 'Asia' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', continent: 'Asia' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', continent: 'Asia' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', continent: 'Asia' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', continent: 'Asia' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', continent: 'Asia' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', continent: 'Asia' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱', continent: 'Asia' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', continent: 'Asia' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', continent: 'Asia' },
    { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', continent: 'Asia' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', continent: 'Asia' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', continent: 'Asia' },
    { code: 'ILS', name: 'Israeli New Shekel', symbol: '₪', continent: 'Asia' },

    // Oceania
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', continent: 'Oceania' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', continent: 'Oceania' },

    // Africa
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', continent: 'Africa' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', continent: 'Africa' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', continent: 'Africa' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', continent: 'Africa' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', continent: 'Africa' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', continent: 'Africa' }
  ];

  // Continents in order for display
  readonly continentOrder = ['Europe', 'North America', 'South America', 'Asia', 'Oceania', 'Africa'];

  private _currenciesByContinent: Map<string, Currency[]>;

  constructor() {
    this._currenciesByContinent = this.groupCurrenciesByContinent();
  }

  private groupCurrenciesByContinent(): Map<string, Currency[]> {
    const result = new Map<string, Currency[]>();

    for (const continent of this.continentOrder) {
      const continentCurrencies = this.currencies
        .filter(c => c.continent === continent)
        .sort((a, b) => a.code.localeCompare(b.code));

      result.set(continent, continentCurrencies);
    }

    return result;
  }

  // Get the current selected currency (signal)
  get current() {
    return this.currentCurrency;
  }

  getAllCurrencies(): Currency[] {
    return this.currencies;
  }

  getAllCurrenciesCode(): string[]{
    return this.getAllCurrencies().map(currency => currency.code);
  }

  // Get all continents with their currencies
  getContinentsWithCurrencies(): Map<string, Currency[]> {
    return this._currenciesByContinent;
  }

  getContinentOrder(): string[] {
    return this.continentOrder;
  }

  setCurrentCurrency(currency: Currency): void {
    this.currentCurrency.set(currency);
  }

  setCurrencyByCode(code: string): void {
    const currency = this.currencies.find(c => c.code === code);
    if (currency) {
      this.currentCurrency.set(currency);
    }
  }
}
