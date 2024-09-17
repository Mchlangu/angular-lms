import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, OnDestroy {
  course: any;
  topics!: any[];
  topic: any;
  courseIndex!: number;
  topicIndex!: number;
  currentQuestionIndex: number = 0;
  currentQuestion: any;
  selectedOption: any = null;
  score: number = 0;
  resultCorrect: boolean = false;
  private routerSubscription!: Subscription;

  // Timer variables
  totalTimeLeft: number = 0; // Total time in seconds for the quiz
  timerInterval!: any;
  formattedTime: string = ''; // Store formatted time here
  remainingMilliseconds: number = 0; // To keep track of the remaining milliseconds

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseIndex = +params['courseIndex'];
      this.topicIndex = +params['topicIndex'];
      this.dataService.getCourses().subscribe(data => {
        this.course = data.courses[this.courseIndex];
        this.topics = this.course.topics;
        this.topic = this.topics[this.topicIndex];
        this.currentQuestionIndex = 0; 
        this.currentQuestion = this.topic.questions[this.currentQuestionIndex];
        const progress = this.dataService.getProgress(this.courseIndex);
        if (progress.courseIndex === this.courseIndex && progress.topicIndex === this.topicIndex) {
          this.currentQuestionIndex = progress.questionIndex;
          this.currentQuestion = this.topic.questions[this.currentQuestionIndex];
        }

        // Calculate the total time based on the number of questions
        this.totalTimeLeft = this.topic.questions.length * 30;
        this.remainingMilliseconds = this.totalTimeLeft * 1000; // Initialize remaining milliseconds

        // Start the total quiz timer
        this.startTimer();
      });

      this.routerSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.saveProgress();
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
    this.clearTimer();
  }

  startTimer(): void {
    this.clearTimer(); // Clear any existing timer
    this.timerInterval = setInterval(() => {
      this.remainingMilliseconds -= 10; // Decrease time by 10ms intervals

      if (this.remainingMilliseconds <= 0) {
        this.clearTimer();
        this.handleTimeUp();
        return;
      }

      const minutes = Math.floor(this.remainingMilliseconds / 60000);
      const seconds = Math.floor((this.remainingMilliseconds % 60000) / 1000);
      const milliseconds = this.remainingMilliseconds % 1000;

      this.formattedTime = this.formatTime(minutes, seconds, milliseconds);
    }, 10); // Update every 10ms to ensure smooth countdown
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatTime(minutes: number, seconds: number, milliseconds: number): string {
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}:${milliseconds.toString().padStart(3, '0')}`;
  }

  handleTimeUp(): void {
    alert('Time is up!');
    this.router.navigate(['/results', { score: this.score, courseIndex: this.courseIndex, topicIndex: this.topicIndex }]);
  }

  selectOption(option: any): void {
    this.selectedOption = option;
    this.checkAnswer();
    this.dataService.saveProgress(this.courseIndex, this.topicIndex, this.currentQuestionIndex);
  }

  checkAnswer(): void {
    if (this.selectedOption.label === this.currentQuestion.correctOption) {
      this.resultCorrect = true;
      this.score += 5;
    } else {
      this.resultCorrect = false;
    }

    setTimeout(() => {
      this.continue();
    }, 1000); // delay
  }

  continue(): void {
    this.selectedOption = null;
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex < this.topic.questions.length) {
      this.currentQuestion = this.topic.questions[this.currentQuestionIndex];
      this.dataService.saveProgress(this.courseIndex, this.topicIndex, this.currentQuestionIndex);
    } else {
      this.dataService.markTopicComplete(this.courseIndex, this.topicIndex);
      this.router.navigate(['/results', { score: this.score, courseIndex: this.courseIndex, topicIndex: this.topicIndex }]);
    }
  }

  closeQuiz(): void {
    this.router.navigate(['/details', this.courseIndex]);
  }

  saveProgress(): void {
    this.dataService.saveProgress(this.courseIndex, this.topicIndex, this.currentQuestionIndex);
  }

  navigateToNextTopic(): void {
    const nextTopicIndex = this.topicIndex + 1;
    if (nextTopicIndex < this.topics.length) {
      this.router.navigate(['/quiz', this.courseIndex, nextTopicIndex]);
    } else {
      this.dataService.markCourseComplete(this.courseIndex);
      this.router.navigate(['/learning']);
    }
  }
}
