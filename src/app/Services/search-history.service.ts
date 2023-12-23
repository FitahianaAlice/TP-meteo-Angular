import { Injectable } from '@angular/core';

@Injectable({
 providedIn: 'root'
})
export class SearchHistoryService {
 recentSearches: string[] = [];

 constructor() { }

 addSearch(search: string) {
   this.recentSearches.unshift(search);
   if (this.recentSearches.length > 5) { // Limit to 5 recent searches
     this.recentSearches.pop();
   }
 }

 getRecentSearches() {
   return this.recentSearches;
 }
}
