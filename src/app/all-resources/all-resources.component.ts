import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CalendarEvent, CalendarUtils, CalendarDayViewComponent } from 'angular-calendar';

import { Subject } from 'rxjs/Subject';
import {
    GetDayViewArgs,
    DayView,
    DayViewEvent
} from 'calendar-utils';

import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';


const EVENT_WIDTH = 150;


// extend the interface to add the array of users
export interface MyDayView extends DayView {
    users: any[];
}


export class MyCalendarUtils extends CalendarUtils {
    getDayView(args: GetDayViewArgs): MyDayView {
        const view = super.getDayView(args) as MyDayView;

        //Empty the users array if do not want to diplay user with no apointments
        //const users = []; 

        view.events.forEach(({ event }) => {
            // assumes user objects are the same references, 
            // if 2 users have the same structure but different object references this will fail
            if (!users.includes(event.meta.user)) {
                users.push(event.meta.user);
                console.log(event.meta.user);
            }
        });
        
        // sort the users by their names
        //users.sort((user1, user2) => user1.name.localeCompare(user2.name));

        //Added users: any[] in DayView interface under C:\myRepositries\Angular\testCalFolder\AppCalendar\node_modules\calendar-utils\dist\calendar-utils.d.ts
        view.users = users;
        view.events = view.events.map((dayViewEvent) => {
            const index = users.indexOf(dayViewEvent.event.meta.user);
            dayViewEvent.left = index * EVENT_WIDTH; // change the column of the event
            return dayViewEvent;
        });
        view.width = users.length * EVENT_WIDTH;
        return view;
    }
}


/***************************************************************** */


@Component({
    selector: 'my-calendar-day-view',
    styles: [`
    .day-view-column-headers {
      display: flex;
      margin-left: 70px;
    }
    .day-view-column-header {
      width: 150px;
      border: solid 1px black;
      text-align: center
    }
  `],
    template: `
    <div class="cal-day-view" #dayViewContainer>
      <div class="day-view-column-headers">
        <div class="day-view-column-header" *ngFor="let user of view?.users">
          {{ user.name }}
        </div>
      </div>
      <div class="cal-hour-rows">
        <div class="cal-events">
          <div
            #event
            *ngFor="let dayEvent of view?.events"
            class="cal-event-container"
            [class.cal-draggable]="dayEvent.event.draggable"
            mwlResizable
            [resizeEdges]="{top: dayEvent.event?.resizable?.beforeStart, bottom: dayEvent.event?.resizable?.afterEnd}"
            [resizeSnapGrid]="{top: eventSnapSize, bottom: eventSnapSize}"
            [validateResize]="validateResize"
            (resizeStart)="resizeStarted(dayEvent, $event, dayViewContainer)"
            (resizing)="resizing(dayEvent, $event)"
            (resizeEnd)="resizeEnded(dayEvent)"
            mwlDraggable
            [dragAxis]="{x: true, y: dayEvent.event.draggable && currentResizes.size === 0}"
            [dragSnapGrid]="{y: eventSnapSize, x: eventWidth}"
            [validateDrag]="validateDrag"
            (dragStart)="dragStart(event, dayViewContainer)"
            (dragEnd)="eventDragged(dayEvent, $event.x, $event.y)"
            [style.marginTop.px]="dayEvent.top"
            [style.height.px]="dayEvent.height"
            [style.marginLeft.px]="dayEvent.left + 70"
            [style.width.px]="dayEvent.width - 1">
            <mwl-calendar-day-view-event
              [dayEvent]="dayEvent"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipTemplate]="tooltipTemplate"
              [customTemplate]="eventTemplate"
              (eventClicked)="eventClicked.emit({event: dayEvent.event})">
            </mwl-calendar-day-view-event>
          </div>
        </div>
        <div class="cal-hour" *ngFor="let hour of hours" [style.minWidth.px]="view?.width + 70">
          <mwl-calendar-day-view-hour-segment
            *ngFor="let segment of hour.segments"
            [segment]="segment"
            [locale]="locale"
            [customTemplate]="hourSegmentTemplate"
            (mwlClick)="hourSegmentClicked.emit({date: segment.date})"
            [class.cal-drag-over]="segment.dragOver"
            mwlDroppable
            (dragEnter)="segment.dragOver = true"
            (dragLeave)="segment.dragOver = false"
            (drop)="segment.dragOver = false; eventDropped($event, segment)">
          </mwl-calendar-day-view-hour-segment>
        </div>
      </div>
    </div>
  `
})
export class MyDayViewComponent extends CalendarDayViewComponent {

    @Output() userChanged = new EventEmitter();

    //eventDragged(dayEvent: DayViewEvent, xPixels: number, yPixels: number): void {
    //    if (yPixels !== 0) {
    //        super.eventDragged(dayEvent, yPixels); // original behaviour
    //    }
    //    if (xPixels !== 0) {
    //        const columnsMoved = xPixels / EVENT_WIDTH;
    //        const currentColumnIndex = this.view.users.findIndex(user => user === dayEvent.event.meta.user);
    //        const newIndex = currentColumnIndex + columnsMoved;
    //        const newUser = this.view.users[newIndex];
    //        this.userChanged.emit({ event: dayEvent.event, newUser });
    //    }
    //}

}

const users = [{
    id: 0,
    name: 'TX Room1'
    },
    {
    id: 1,
        name: 'TX Room2'
    },
    {
        id: 2,
        name: 'Pedicure 1'
    },
    {
        id: 3,
        name: 'Pedicure 2'
    },
    {
        id: 4,
        name: 'Pedicure 3'
    },
    {
        id: 5,
        name: 'Manicure 1'
    },
    {
        id: 6,
        name: 'Manicure 2'
    },
    {
        id: 7,
        name: 'Threading'
}];


/***************************************************************** */

export const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};




@Component({
    selector: 'app-all-resources',
    changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './all-resources.component.html',
    styleUrls: ['./all-resources.component.css'],
    providers: [{
        provide: CalendarUtils,
        useClass: MyCalendarUtils
    }]
})
export class AllResourcesComponent implements OnInit {
    view: string = 'day';
    viewDate: Date = new Date();

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [{
        title: 'An event smith',
        color: colors.yellow,
        start: addHours(startOfDay(new Date()), 5),
        meta: {
            user: users[0]
        },
        resizable: {
            beforeStart: true,
            afterEnd: true
        },
        draggable: true
    }, {
        title: 'Another event dae',
        color: colors.blue,
        start: addHours(startOfDay(new Date()), 2),
        meta: {
            user: users[1]
        },
        resizable: {
            beforeStart: true,
            afterEnd: true
        },
        draggable: true
    }, {
        title: 'An 3rd event smith',
        color: colors.red,
        start: addHours(startOfDay(new Date()), 7),
        meta: {
            user: users[0]
        },
        resizable: {
            beforeStart: true,
            afterEnd: true
        },
        draggable: true
        },
        {
            title: 'Apna Event dae',
            color: colors.red,
            start: addHours(startOfDay(new Date()), -7),
            meta: {
                user: users[1]
            },
            resizable: {
                beforeStart: true,
                afterEnd: true
            },
            draggable: true
        },
        {
            title: 'Ek hoor Event bhatti',
            color: colors.red,
            start: addHours(startOfDay(new Date()), -7),
            meta: {
                user: users[2]
            },
            resizable: {
                beforeStart: true,
                afterEnd: true
            },
            draggable: true
        }];

    //eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    //    event.start = newStart;
    //    event.end = newEnd;
    //    this.refresh.next();
    //}

    userChanged({ event, newUser }) {
        event.meta.user = newUser;
        this.refresh.next();
    }

  ngOnInit() {
  }

}
