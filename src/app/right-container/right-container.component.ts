import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-right-container',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './right-container.component.html',
  styleUrl: './right-container.component.css'
})
export class RightContainerComponent {

  constructor(public weatherService: WeatherService){};

  recentSearches: string[] = ['Antananarivo, Madagascar', 'Antsiranana, Madagascar', 'Paris, France'];

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
}
