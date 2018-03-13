import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllResourcesComponent, MyDayViewComponent } from './all-resources.component';
import { CalUtilsModule } from './../cal-utils/cal-utils.module';
import { CalendarModule } from 'angular-calendar';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { DayNotesComponent } from './day-notes/day-notes.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CalEventsService } from '../cal-events.service';
//import { DemoComponent, MyDayViewComponent } from './component';

@NgModule({
  imports: [
      CommonModule,
      CalUtilsModule,
      CalendarModule,
      ResizableModule,
      DragAndDropModule,
      CalUtilsModule,
      BrowserModule,
        FormsModule 
  ],
    declarations: [AllResourcesComponent, MyDayViewComponent, DayNotesComponent],
    exports: [
        AllResourcesComponent
    ]
})
export class AllResourcesModule { }
