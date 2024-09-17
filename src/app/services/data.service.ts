import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/mock-data.json';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any> {
    return this.http.get(this.dataUrl);
  }

  getCourseByIndex(index: number): Observable<any> {
    return this.getCourses().pipe(
      map((courses: any[]) => courses[index])
    );
  }

  saveProgress(courseIndex: number, topicIndex: number, questionIndex: number): void {
    const progressKey = `userProgress_${courseIndex}`;
    const progress = { courseIndex, topicIndex, questionIndex };
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }
  
  getProgress(courseIndex: number): any {
    const progressKey = `userProgress_${courseIndex}`;
    const progress = localStorage.getItem(progressKey);
    return progress ? JSON.parse(progress) : { courseIndex, topicIndex: 0, questionIndex: 0 };
  }
  
  markTopicComplete(courseIndex: number, topicIndex: number): void {
    localStorage.setItem(`topicComplete_${courseIndex}_${topicIndex}`, 'true');
  }

  isTopicComplete(courseIndex: number, topicIndex: number): boolean {
    return localStorage.getItem(`topicComplete_${courseIndex}_${topicIndex}`) === 'true';
  }

  markCourseComplete(courseIndex: number): void {
    localStorage.setItem(`courseComplete_${courseIndex}`, 'true');
  }

  isCourseComplete(courseIndex: number): boolean {
    return localStorage.getItem(`courseComplete_${courseIndex}`) === 'true';
  }
}
