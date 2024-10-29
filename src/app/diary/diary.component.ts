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
  theme: 'light' | 'dark' = 'light';

  filterMonth: string = '';
  filterYear: string = '';
  filteredEntries: DiaryEntry[] = [];
  availableYears: string[] = []; // Доступні роки для фільтру

  constructor(private renderer: Renderer2) {
    this.loadEntries();
    this.updateBodyClass();
  }

  addEntry() {
    if (this.newEntry.trim()) {
      const newDiaryEntry: DiaryEntry = {
        content: this.newEntry.trim(),
        date: new Date().toLocaleString()
      };
      this.entries.push(newDiaryEntry);
      this.newEntry = '';
      this.saveEntries();
      this.updateAvailableYears(); // Оновлюємо список років
      this.applyFilter(); // Оновлюємо фільтр після додавання
    }
  }

  deleteEntry(index: number) {
    if (index >= 0 && index < this.entries.length) {
      this.entries.splice(index, 1);
      this.saveEntries();
      this.updateAvailableYears(); // Оновлюємо список років
      this.applyFilter(); // Оновлюємо фільтр після видалення
    }
  }

  deleteAllEntries() {
    this.entries = [];
    this.saveEntries();
    this.updateAvailableYears(); // Очищаємо список років після видалення всіх записів
    this.applyFilter(); // Оновлюємо фільтр після видалення всіх записів
  }

  saveEntries() {
    localStorage.setItem('diaryEntries', JSON.stringify(this.entries));
  }

  loadEntries() {
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
      this.entries = JSON.parse(savedEntries);
    }
    this.updateAvailableYears(); // Оновлюємо список років після завантаження
    this.applyFilter(); // Застосовуємо фільтр після завантаження
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.updateBodyClass();
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

  applyFilter() {
    this.filteredEntries = this.entries.filter(entry => {
      const entryDate = new Date(entry.date);
      const monthMatches = this.filterMonth ? (entryDate.getMonth() + 1).toString().padStart(2, '0') === this.filterMonth : true;
      const yearMatches = this.filterYear ? entryDate.getFullYear().toString() === this.filterYear : true;
      return monthMatches && yearMatches;
    });
  }

  updateAvailableYears() {
    const years = new Set<string>();
    this.entries.forEach(entry => {
      const year = new Date(entry.date).getFullYear().toString();
      years.add(year);
    });
    this.availableYears = Array.from(years).sort();
  }
}
