import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() totalTime: number = 0; // Input for total time in seconds
  @Output() timeUp = new EventEmitter<void>(); // Event emitter for when time is up
  @Output() timeLeft = new EventEmitter<number>(); // Event emitter for remaining time

  timerInterval!: any;
  remainingMilliseconds: number = 0;
  formattedMinutes: string = '';
  formattedSeconds: string = '';
  formattedMilliseconds: string = '';

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  startTimer(): void {
    this.clearTimer(); // Clear any existing timer
    this.remainingMilliseconds = this.totalTime * 1000;

    this.timerInterval = setInterval(() => {
      this.remainingMilliseconds -= 10; // Decrease time by 10ms intervals

      if (this.remainingMilliseconds <= 0) {
        this.clearTimer();
        this.timeUp.emit(); // Emit event when time is up
        return;
      }

      const minutes = Math.floor(this.remainingMilliseconds / 60000);
      const seconds = Math.floor((this.remainingMilliseconds % 60000) / 1000);
      const milliseconds = this.remainingMilliseconds % 1000;

      this.formattedMinutes = this.formatNumber(minutes);
      this.formattedSeconds = this.formatNumber(seconds);
      this.formattedMilliseconds = milliseconds.toString().padStart(3, '0');

      this.timeLeft.emit(this.remainingMilliseconds / 1000); // Emit remaining time in seconds
    }, 10);
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  formatNumber(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
