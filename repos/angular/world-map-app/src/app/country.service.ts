import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: HttpClient) {}

  getCountry(code: string) {
    return this.http.get(`https://api.worldbank.org/v2/country/${code}?format=json`);
  }
}