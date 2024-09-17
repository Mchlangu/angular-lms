import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  course: any;
  topics!: any[];
  courseIndex!: number;
  progress: any;

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseIndex = +params['courseIndex'];
      this.dataService.getCourses().subscribe(data => {
        this.course = data.courses[this.courseIndex];
        this.topics = this.course.topics;
        this.progress = this.dataService.getProgress(this.courseIndex);
        
        // Check if the course is complete
        const courseComplete = this.dataService.isCourseComplete(this.courseIndex);
  
        if (courseComplete) {
          // If the course is complete, unlock all topics
          this.topics = this.topics.map(topic => ({ ...topic, locked: false }));
        } else {
          // Lock or unlock topics based on progress
          this.topics = this.topics.map((topic, index) => ({
            ...topic,
            locked: index > this.progress.topicIndex
          }));
        }
      });
    });
  }

  navigateToQuiz(topicIndex: number): void {
    if (!this.topics[topicIndex].locked) {
      this.router.navigate(['/quiz', this.courseIndex, topicIndex]);
    } else {
      alert('You must complete the current course before accessing this topic.');
    }
  }
}