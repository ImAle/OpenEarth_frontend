export interface Currency {
  code: string;      //(USD, EUR, etc.)
  name: string;
  symbol: string;    // Currency symbol ($, €, etc.)
  continent: string; // Continent it belongs to
}
