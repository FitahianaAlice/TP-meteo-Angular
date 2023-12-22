import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCloud, faCloudRain, faLocation, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';


@Component({
  selector: 'app-left-container',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './left-container.component.html',
  styleUrl: './left-container.component.css'
})
export class LeftContainerComponent {
  faMagnifyingGlass:any = faMagnifyingGlass;
  faLocation:any = faLocation;

  faCloud:any = faCloud;
  faCloudRain:any = faCloudRain;

  constructor(public weatherService:WeatherService){
    
  }
}
