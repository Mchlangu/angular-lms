import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnDestroy {
  score: number = 0;
  courseIndex!: number;
  topicIndex!: number;
  topics: any[] = [];
  hasNextTopic: boolean = false;

  private popStateSubscription!: () => void;

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.score = +params['score'];
      this.courseIndex = +params['courseIndex'];
      this.topicIndex = +params['topicIndex'];
      this.dataService.getCourses().subscribe(data => {
        this.topics = data.courses[this.courseIndex].topics;
        this.hasNextTopic = this.topicIndex < this.topics.length - 1;
        if (!this.hasNextTopic) {
          this.dataService.markCourseComplete(this.courseIndex);
        }
      });
    });

    // Listen to the browser's back and forward navigation
    this.popStateSubscription = () => {
      window.addEventListener('popstate', this.handleBackNavigation.bind(this));
    };
  }

  ngOnDestroy(): void {
    // Clean up the popstate event listener
    window.removeEventListener('popstate', this.handleBackNavigation.bind(this));
  }

  handleBackNavigation(event: PopStateEvent): void {
    const reattempt = confirm('Would you like to reattempt the quiz?');
    if (reattempt) {
      // If the user wants to reattempt, reset the quiz and navigate back to the quiz component
      this.reAttemptQuiz();
    } else {
      // If the user doesn't want to reattempt, navigate them back to the learning page
      this.navigateToLearning();
    }
  }
  

  navigateToNextTopic(): void {
    // Navigate to the next topic without triggering any prompt
    if (this.hasNextTopic) {
      const nextTopicIndex = this.topicIndex + 1;
      this.router.navigate(['/quiz', this.courseIndex, nextTopicIndex]);
    } else {
      this.router.navigate(['/learning']);
    }
  }

  navigateToLearning(): void {
    this.router.navigate(['/learning']);
  }

  reAttemptQuiz(): void {
    // Reset the progress for the current topic and clear selected options
    localStorage.setItem(`userProgress_${this.courseIndex}`, JSON.stringify({ courseIndex: this.courseIndex, topicIndex: this.topicIndex, questionIndex: 0 }));
    this.router.navigate(['/quiz', this.courseIndex, this.topicIndex]);
  }
}
