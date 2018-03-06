import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllResourcesComponent, MyDayViewComponent } from './all-resources.component';
import { CalUtilsModule } from './../cal-utils/cal-utils.module';
import { CalendarModule } from 'angular-calendar';
import { ResizableModule } from 'angular-resizable-element';
import { DragAndDropModule } from 'angular-draggable-droppable';
//import { DemoComponent, MyDayViewComponent } from './component';

@NgModule({
  imports: [
      CommonModule,
      CalUtilsModule,
      CalendarModule,
      ResizableModule,
      DragAndDropModule,
      CalUtilsModule
  ],
    declarations: [AllResourcesComponent, MyDayViewComponent],
    exports: [
        AllResourcesComponent
    ]
})
export class AllResourcesModule { }
