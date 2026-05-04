import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CountryService } from '../country.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  country: any;
  message = 'Click a country on the map';

  constructor(
    private countryService: CountryService,
    private changeDetector: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const svgObject = document.querySelector('object') as HTMLObjectElement;

    svgObject?.addEventListener('load', () => {
      const svgDoc = svgObject.contentDocument;
      const countries = svgDoc?.querySelectorAll('path, polygon, g');

      countries?.forEach((countryElement: any) => {
        countryElement.addEventListener('click', () => {
          const rawCode =
            countryElement.id ||
            countryElement.getAttribute('data-id') ||
            countryElement.getAttribute('data-code') ||
            countryElement.parentElement?.id;

          console.log('Clicked raw country code:', rawCode);

          if (!rawCode) {
            this.message = 'This part of the map does not have a country code.';
            this.changeDetector.detectChanges();
            return;
          }

          const countryCode = rawCode.substring(0, 2).toUpperCase();
          console.log('Clean country code sent to API:', countryCode);

          this.getCountryData(countryCode);
        });

        countryElement.addEventListener('mouseover', () => {
          countryElement.style.fill = '#6fa8dc';
          countryElement.style.cursor = 'pointer';
        });

        countryElement.addEventListener('mouseout', () => {
          countryElement.style.fill = '';
        });
      });
    });
  }

  getCountryData(code: string) {
    this.message = 'Loading country information...';
    this.changeDetector.detectChanges();

    this.countryService.getCountry(code).subscribe({
      next: (data: any) => {
        console.log('API response:', data);

        if (data && data[1] && data[1][0]) {
          this.country = data[1][0];
          this.message = '';
        } else {
          this.country = null;
          this.message = 'No country information found for code: ' + code;
        }

        this.changeDetector.detectChanges();
      },
      error: (error) => {
        console.log('API error:', error);
        this.country = null;
        this.message = 'API error. Check the console.';
        this.changeDetector.detectChanges();
      }
    });
  }
}