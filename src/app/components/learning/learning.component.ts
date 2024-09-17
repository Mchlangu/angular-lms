import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})
export class LearningComponent implements OnInit {
  courses: any[] = [];
  course: any;

  constructor(public router: Router, public dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getCourses().subscribe(data => {
      this.courses = data.courses;
    });
  }

  navigateToDetails(courseIndex: number): void {
    // Check if the previous course is complete
    if (courseIndex === 0 || this.dataService.isCourseComplete(courseIndex - 1)) {
      this.router.navigate(['/details', courseIndex]);
    } else {
      this.dataService.getCourseByIndex(courseIndex).subscribe(data=>{ 
        this.course = data;
        alert(this.course)
        alert('Please complete' +'before moving to the next.');
      })

    }
  }
  
}


