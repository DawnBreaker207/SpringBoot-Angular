import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Luv2ShopFormService {
  private countriesUrl = environment.luv2shopApiUrl + '/countries';
  private statesUrl = environment.luv2shopApiUrl + '/states';
  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((res) => res._embedded.countries));
  }

  getStates(countryCode: string): Observable<State[]> {
    const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient
      .get<GetResponseStates>(searchStateUrl)
      .pipe(map((res) => res._embedded.states));
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    return of(data);
  }
  getCreditCardYear(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }
    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}
interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
