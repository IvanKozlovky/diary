import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface DiaryEntry {
  content: string;
  date: string; // Дата
}

@Component({
  selector: 'app-diary',
  standalone: true,
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class DiaryComponent {
  entries: DiaryEntry[] = [];
  newEntry: string = '';
  theme: 'light' | 'dark' = 'light'; // Тема, за замовчуванням світла

  constructor(private renderer: Renderer2) {
    this.loadEntries(); // Завантажити записи при ініціалізації
    this.updateBodyClass(); // Додати клас для body на основі теми
  }

  addEntry() {
    if (this.newEntry.trim()) {
      const newDiaryEntry: DiaryEntry = {
        content: this.newEntry.trim(),
        date: new Date().toLocaleString() // Формат дати
      };
      this.entries.push(newDiaryEntry);
      this.newEntry = '';
      this.saveEntries(); // Зберегти записи
    }
  }

  deleteAllEntries() {
    this.entries = [];
    this.saveEntries(); // Зберегти записи
  }

  saveEntries() {
    localStorage.setItem('diaryEntries', JSON.stringify(this.entries)); // Зберігаємо у Local Storage
  }

  loadEntries() {
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
      this.entries = JSON.parse(savedEntries); // Завантажуємо з Local Storage
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light'; // Перемикаємо тему
    this.updateBodyClass(); // Оновлюємо клас body
  }

  updateBodyClass() {
    if (this.theme === 'light') {
      this.renderer.removeClass(document.body, 'dark');
      this.renderer.addClass(document.body, 'light');
    } else {
      this.renderer.removeClass(document.body, 'light');
      this.renderer.addClass(document.body, 'dark');
    }
  }
}
