import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningComponent } from './components/learning/learning.component';
import { DetailsComponent } from './components/details/details.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultsComponent } from './components/results/results.component';

const routes: Routes = [
  { path: '', redirectTo: '/learning', pathMatch: 'full' },
  { path: 'learning', component: LearningComponent },
  { path: 'details/:courseIndex', component: DetailsComponent },
  { path: 'quiz/:courseIndex/:topicIndex', component: QuizComponent },
  { path: 'results', component: ResultsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
