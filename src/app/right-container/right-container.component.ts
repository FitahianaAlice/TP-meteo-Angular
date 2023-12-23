import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { WeatherService } from '../Services/weather.service';
import { SearchHistoryService } from '../Services/search-history.service';

@Component({
  selector: 'app-right-container',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './right-container.component.html',
  styleUrl: './right-container.component.css'
})
export class RightContainerComponent {

  recentSearches: string[] = this.searchHistoryService.getRecentSearches();
recent: any;

  constructor(public weatherService: WeatherService,private searchHistoryService: SearchHistoryService){};

  onTodayClick(){
    this.weatherService.recent = false;
    this.weatherService.today = true;
  }
  onRecentClick(){
    this.weatherService.recent = true;
    this.weatherService.today = false;
  }

  onCelsiusClick(){
    this.weatherService.celsius = true;
    this.weatherService.fahrenheit = false;
  }
  onFahrenheitClick(){
    this.weatherService.fahrenheit = true;
    this.weatherService.celsius = false;
  }
  onSearch(location: string) {
    // Perform the search...
   
    // Then add the search to the history
    this.searchHistoryService.addSearch(location);
   }
}
