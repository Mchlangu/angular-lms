import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { quizGuardGuard } from './quiz-guard.guard';

describe('quizGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => quizGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
