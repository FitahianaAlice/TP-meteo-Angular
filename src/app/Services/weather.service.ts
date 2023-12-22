import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { TemperatureData } from '../Models/TemperatureData';
import { TodayData } from '../Models/TodayData';
import { TodaysHighlights } from '../Models/TodaysHighlights';
import { Observable } from 'rxjs';
import { EnvironmentalVariables } from '../Environment/EnvironmentVariable';
import { response } from 'express';
import { get } from 'http';
import { faH } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  temperatureData: TemperatureData = new TemperatureData();

  todayData?: TodayData[] = [];
  todaysHighlights: TodaysHighlights = new TodaysHighlights();

  cityName:string ='Antananarivo';
  language:string ='en-US';
  date:string = '20231222';
  units:string = 'm';

  currentTime:Date;

  today:boolean = false;
  recent:boolean = true;

  celsius:boolean = true;
  fahrenheit:boolean = false;

  constructor(private httpClient: HttpClient) {
    this.getData();
   }

   getSummaryImage(summary:string):string{
    var baseAdress = 'assets/';

    var cloudySunny = 'cloudyandsunny.png';
    var rainySunny = 'rainyandsunny.png';
    var windy = 'windy.png';
    var sunny = 'sunny.png';
    var rainy = 'rain.png';

    if(String(summary).includes("Partly Cloudy") || String(summary).includes("P Cloudy"))return baseAdress + cloudySunny;
    else if(String(summary).includes("Partly Rainy") || String(summary).includes("P Rainy"))return baseAdress + rainySunny;
    else if(String(summary).includes("wind"))return baseAdress + windy;
    else if(String(summary).includes("rain"))return baseAdress + rainy;
    else if(String(summary).includes("Sun"))return baseAdress + sunny;

    return baseAdress + cloudySunny;
   }

   fillTemperatureDataModel(){
    this.currentTime = new Date();
    this.temperatureData.day = this.weatherDetails['v3-wx-observations-current'].dayOfWeek;
    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2,'0')}:${String(this.currentTime.getMinutes()).padStart(2,'0')}`;
    this.temperatureData.temperature = this.weatherDetails['v3-wx-observations-current'].temperature;
    this.temperatureData.location = `${this.locationDetails.location.city[0]},${this.locationDetails.location.country[0]}`;
    this.temperatureData.rainPercent = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
    this.temperatureData.summaryPhrase = this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;
    this.temperatureData.summaryImage = this.getSummaryImage(this.temperatureData.summaryPhrase);
   }

   fillTodayData(){
    var todayCount = 0;
    while(todayCount < 7){
      this.todayData.push(new TodayData());
      this.todayData[todayCount].time = this.weatherDetails['v3-wx-forecast-hourly-10day'].validTimeLocal[todayCount].slice(11,16);
      this.todayData[todayCount].temperature = this.weatherDetails['v3-wx-forecast-hourly-10day'].temperature[todayCount];
      this.todayData[todayCount].summaryImage = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[todayCount]);
      todayCount++;
    }
   }

   getTimeFromString(localTime:string){
    return localTime.slice(12,17);
   }

   fillTodaysHighlights(){
    this.todaysHighlights.airQuality = this.weatherDetails['v3-wx-globalAirQuality'].globalairquality.airQualityIndex;
    this.todaysHighlights.humdity = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
    this.todaysHighlights.sunrise = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunriseTimeLocal);
    this.todaysHighlights.sunset = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunsetTimeLocal);
    this.todaysHighlights.uvIndex = this.weatherDetails['v3-wx-observations-current'].uvIndex;
    this.todaysHighlights.visibility = this.weatherDetails['v3-wx-observations-current'].visibility;
    this.todaysHighlights.windStatus = this.weatherDetails['v3-wx-observations-current'].windSpeed;
   }

   prepareData(): void {
    this.fillTemperatureDataModel();
    this.fillTodayData();
    this.fillTodaysHighlights();
    console.log(this.temperatureData);
    console.log(this.todayData);
    console.log(this.todaysHighlights);
   }
   
   celsiusToFahrenheit(celsius:number):number{
    return +((celsius * 1.8) + 32).toFixed(2);
   }
   fahrenheitToCelcius(fahrenheit:number):number{
    return +((fahrenheit - 32) * 0.555).toFixed(2);
   }


  getLocationDetails(cityName:string, language:string):Observable<LocationDetails>{
    return this.httpClient.get <LocationDetails>(EnvironmentalVariables.weatherApiLocationBaseURL,{
      headers: new HttpHeaders()
      .set(EnvironmentalVariables.xRapidApiKeyName,EnvironmentalVariables.xRapidApiKeyValue)
      .set(EnvironmentalVariables.xRapidApiHostName,EnvironmentalVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('query', cityName)
      .set('language', language)
    })
  }

  getWeatherReport(date:string, latitude:number, longitude:number, language:string, units:string):Observable<WeatherDetails>{
    return this.httpClient.get <WeatherDetails>(EnvironmentalVariables.weatherApiForecastBaseURL,{
      headers: new HttpHeaders()
      .set(EnvironmentalVariables.xRapidApiKeyName,EnvironmentalVariables.xRapidApiKeyValue)
      .set(EnvironmentalVariables.xRapidApiHostName,EnvironmentalVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('date', date)
      .set('latitude',latitude)
      .set('longitude',longitude)
      .set('units', units)
    });
  }

  getData(){
    var latitude = 0;
    var longitude = 0;

    this.getLocationDetails(this.cityName, this.language).subscribe({
      next:(response) =>{
        this.locationDetails = response;
        latitude = this.locationDetails?.location.latitude[0];
        longitude = this.locationDetails?.location.longitude[0];

        this.getWeatherReport(this.date, latitude, longitude, this.language, this.units).subscribe({
          next:(response) => {
            this.weatherDetails = response;

            this.prepareData();
          }
        })
      }
    });

  }
}


