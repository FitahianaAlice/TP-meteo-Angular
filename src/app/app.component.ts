import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RightContainerComponent } from "./right-container/right-container.component";
import { LeftContainerComponent } from "./left-container/left-container.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, RightContainerComponent, LeftContainerComponent]
})
export class AppComponent {
  title = 'weatherApp';
}
