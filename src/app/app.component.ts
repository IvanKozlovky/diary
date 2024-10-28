import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DiaryComponent } from './diary/diary.component'; // Імпортуємо DiaryComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DiaryComponent], // Додаємо DiaryComponent до imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'diary-app';
}
