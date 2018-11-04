import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllResourcesComponent, MyDayViewComponent } from './all-resources.component';
import { CalUtilsModule } from './../cal-utils/cal-utils.module';
import { CalendarModule, CalendarNativeDateFormatter, CalendarDateFormatter, DateFormatterParams  } from 'angular-calendar';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { DayNotesComponent } from './day-notes/day-notes.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CalEventsService } from '../cal-events.service';
//import { DemoComponent, MyDayViewComponent } from './component';

export class CustomDateFormatter extends CalendarNativeDateFormatter {

    public dayViewHour({date, locale}: DateFormatterParams): string {
      return new Intl.DateTimeFormat('en-us', {
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    }
  
  }


@NgModule({
  imports: [
      CommonModule,
      CalUtilsModule,
      CalendarModule.forRoot({
        dateFormatter: {
          provide: CalendarDateFormatter, 
          useClass: CustomDateFormatter
        }
      }),
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
