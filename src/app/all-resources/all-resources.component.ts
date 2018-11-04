import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, TemplateRef, OnChanges } from '@angular/core';
import { CalendarEvent, CalendarUtils, CalendarDayViewComponent, CalendarMonthViewDay } from 'angular-calendar';

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
    addHours,
    differenceInMinutes
} from 'date-fns';


import { CalEventsService } from './../cal-events.service'
import { CustomEventTitleFormatter } from './../custom-event-title-formatter.service';
import { AuthService } from './../core/auth.service';
import { eventsAPI } from './../app.component';
import { Services } from './../cal-utils/services.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DayNotes } from './dayNotes.model';


const EVENT_WIDTH = 120;


// extend the interface to add the array of users
export interface MyDayView extends DayView {
    chairs: any[];
}


export class MyCalendarUtils extends CalendarUtils {
    getDayView(args: GetDayViewArgs): MyDayView {
        const view = super.getDayView(args) as MyDayView;

        //Empty the users array if do not want to diplay user with no apointments
        //const users = []; 

        view.events.forEach(({ event }) => {
            // assumes user objects are the same references, 
            // if 2 users have the same structure but different object references this will fail
            if (!chairs.includes(event.meta.chair)) {
                chairs.push(event.meta.chair);
                console.log(event.meta.chair);
            }
        });
        
        // sort the users by their names
        //users.sort((user1, user2) => user1.name.localeCompare(user2.name));

        //Added users: any[] in DayView interface under C:\myRepositries\Angular\testCalFolder\AppCalendar\node_modules\calendar-utils\dist\calendar-utils.d.ts
        view.chairs = chairs;
        view.events = view.events.map((dayViewEvent) => {
            const index = chairs.indexOf(dayViewEvent.event.meta.chair);
            dayViewEvent.left = index * EVENT_WIDTH; // change the column of the event
            return dayViewEvent;
        });
        view.width = chairs.length * EVENT_WIDTH;
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
      position: fixed; /* Set the navbar to fixed position */
      z-index: 10;
      margin-top: 0;
    }
    .day-view-column-header {
      width: 120px;
      border: solid 1px black;
      text-align: center;
       background-color: lightgrey;

    }
 a{
    color: #000000  !important;
     text-decoration: none;
}
  `],
    template: `
    <div class="cal-day-view" #dayViewContainer>
      <div class="day-view-column-headers">
        <div class="day-view-column-header" *ngFor="let chair of view?.chairs">
        <a><b>  {{ chair.name }} </b></a>
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
    //@Output() notesChanged = new EventEmitter<String>();

    eventDragged1(dayEvent: DayViewEvent, xPixels: number, yPixels: number): void {
        if (yPixels !== 0) {
            super.eventDragged(dayEvent, yPixels); // original behaviour
        }
        if (xPixels !== 0) {
            const columnsMoved = xPixels / EVENT_WIDTH;
            const currentColumnIndex = this.view['chairs'].findIndex(chair => chair === dayEvent.event.meta.chair);
            const newIndex = currentColumnIndex + columnsMoved;
            const newUser = this.view['chairs'][newIndex];
            this.userChanged.emit({ event: dayEvent.event, newUser });
        }
    }

}


/***************************************************************** */

const chairs = [{
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
    },
    green: {
        primary: '#00ff00',
        secondary: '#d0ffd0'
    }
};




@Component({
    selector: 'app-all-resources',
    changeDetection: ChangeDetectionStrategy.Default, 
  templateUrl: './all-resources.component.html',
    styleUrls: ['./all-resources.component.css'],
    providers: [{
        provide: CalendarUtils,
        useClass: MyCalendarUtils
    }]
})
export class AllResourcesComponent implements OnInit, OnChanges  {
    view: string = 'day';
   //_viewDate: Date = new Date();
   //Updated below to route on day click
   _viewDate: Date;
    get viewDate(): Date {
        return this._viewDate
    }
   set viewDate(val: Date) {
    this._viewDate = val;
    //this.getCurrentNotes(val);
  }

  
    refresh: Subject<any> = new Subject();

    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    modalRef: NgbModalRef;


    filteredEvents: eventsAPI[];

    eventService: Services[];
    evenServicesName: string[];
    //   eventServiceJoin: string;
    eventServiceJoin1: string[] = [];
    serviceIds: number[] = [];
    eventServiceIDs: Array<number[]> = [];


    activeDayIsOpen: boolean = true;
   
    durationMins: number;
    durationHrs: string;
    _tempMins: number;
    _tempMinsStr: string;



    /*   events: CalendarEvent[] = []; */
    events: Array<CalendarEvent<{ $key: string; name: string, phone: string, landline: string, service: string, gender: string, stylist_title: string, notes: string, chair: any, serviceOptionIds: number[], type: string }>> = []


    eventColor: any;
    eventType: string;
    /* used to sort the dates in filteredevents array */
    dat1: Date = new Date();
    dat2: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    createModalRef: NgbModalRef;

    //Day notes vaiables
    allDayNotes: DayNotes[];
    monthNames: any = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
    todaysNotes: String;
    selectedNote: DayNotes;

    constructor(public _caleventService: CalEventsService, public auth: AuthService, public modal: NgbModal) {  }

    ngOnInit() {

        var x = this._caleventService.getFirebaseData();
        x.snapshotChanges().subscribe(item => {
            this.filteredEvents = [];
            this.eventServiceJoin1 = [];
            this.eventServiceIDs = [];
            item.forEach(element => {
                var y = element.payload.toJSON();
                y["$key"] = element.key;
                this.filteredEvents.push(y as eventsAPI);
                
            });
            console.log(this.filteredEvents);
            this.sortByDate();
            this.loadServices();
            //call load events in load services
            //            this.loadevents();

        });


        //get all day notes
        var z = this._caleventService.getFirebaseDayNotesData();
        // z.snapshotChanges().subscribe(item => {
        //     this.allDayNotes = [];
            
        //     item.forEach(element => {
        //         var n = element.payload.toJSON();
        //         n["$key"] = element.key;
        //         this.allDayNotes.push(n as DayNotes);

        //     });
        //     console.log(this.allDayNotes);

        // });

        z.snapshotChanges().subscribe(item => {
            this.allDayNotes = [];
            this.todaysNotes = "";
            this.selectedNote = null;
            item.forEach(element => {
                var y = element.payload.toJSON();
                y["$key"] = element.key;
                this.allDayNotes.push(y as DayNotes);

                var dummy = y["day"];
                 /* for double digits date (10-31) */
                 if (dummy.substring(8, 10) == this.viewDate.getDate().toString() && dummy.substring(4, 7) == this.monthNames[this.viewDate.getMonth()] && dummy.substring(11, 15) == this.viewDate.getFullYear().toString()) {
                    this.todaysNotes = y["notes"];
                    this.selectedNote = y as DayNotes;

                }
                /* for date with single digits (1-9) */
                else if (dummy.substring(9, 10) == this.viewDate.getDate().toString() && dummy.substring(4, 7) == this.monthNames[this.viewDate.getMonth()] && dummy.substring(11, 15) == this.viewDate.getFullYear().toString()) {
                    this.todaysNotes = y["notes"];
                    this.selectedNote = y as DayNotes;
                }
            });
            console.log(this.allDayNotes);
            console.log(this.todaysNotes);
            console.log(this.selectedNote);
            console.log(this._caleventService.selectedNote);
        });

         // Updated this to implement routing on moth day click
         this.viewDate = this._caleventService.clickedDate;
    }


    public sortByDate(): void {
        this.filteredEvents.sort((a: eventsAPI, b: eventsAPI) => {

            this.dat1 = new Date(a.start);
            this.dat2 = new Date(b.start);
            return this.dat1.getTime() - this.dat2.getTime();


        });
    }

    //this function is used to diplay Modal when event is clicked

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        //this.modalRef = this.modal.open(this.modalContent, { size: 'sm' });
        this.modalRef = this.modal.open(this.modalContent, { size: 'lg' });
        console.log(event);
        console.log(this.modalRef);
        // Assign values of selected appointment to selected events
        /* this._caleventService.appointmentToUpdate.$key = event.meta.$key;
        this._caleventService.appointmentToUpdate.firstname = event.meta.firstname;
        this._caleventService.appointmentToUpdate.lastname = event.meta.lastname;
        this._caleventService.appointmentToUpdate.gender = event.meta.gender;
        this._caleventService.appointmentToUpdate.stylist_title = event.meta.stylist_title;
        this._caleventService.appointmentToUpdate.start = event.start;
        this._caleventService.appointmentToUpdate.end = event.end;
        */
        this._caleventService.appointmentToUpdate = {
            $key: event.meta.$key,
            name: event.meta.name,
            phone: event.meta.phone,
            landline: event.meta.landline,
            service: event.meta.service,
            start: event.start,
            end: event.end,
            stylist_title: event.meta.stylist_title,
            gender: event.meta.gender,
            notes: event.meta.notes,
            chair: event.meta.chair.name
        }

        //Place code to fill duration
        this.durationMins = differenceInMinutes(event.end, event.start);
        this.durationHrs = Number(this.durationMins / 60).toFixed(2);
        console.log(this.durationHrs);
        console.log(Number(Number(this.durationHrs.substring(2, 4)) / 100) * 60);
        this._tempMins = Math.round(Number(Number(this.durationHrs.substring(2, 4)) / 100) * 60);

        if (this._tempMins > 9) {
            this._tempMinsStr = this._tempMins.toString();
        }
        else {
            this._tempMinsStr = "0" + this._tempMins;
        }

        console.log(this._tempMinsStr);
        this._caleventService._durationString1 = this.durationHrs.substring(0, 1) + ":" + this._tempMinsStr;

        //Set the option optionsMultiselect array in Service to select the required service IDs IDs
        this._caleventService.optionsMultiselect = event.meta.serviceOptionIds;
    }


    loadServices(): void {
        //initialize to empty array in ngOnInit menthod
        //this.eventServiceJoin1 = [];
        //this.eventServiceIDs = [];

        for (var i: number = 0; i < this.filteredEvents.length; i++) {

            //get all services in new array from firebase
            var z = this._caleventService.getFirebaseServiceData(this.filteredEvents[i].$key);
            var eventServiceJoin: string;
            z.snapshotChanges().subscribe(item => {
                this.eventService = [];
                this.evenServicesName = [];
                this._caleventService.optionsMultiselect = [];
                this.serviceIds = [];
                //this.eventServiceJoin1 = [];
                item.forEach(element => {
                    var y = element.payload.toJSON();
                    // y["$key"] = element.key;
                    this.eventService.push(y as Services);
                    this.evenServicesName.push(y["name"]);
                    //this._caleventService.optionsMultiselect.push(y["id"]);
                    this.serviceIds.push(y["id"]);
                    //console.log(y["name"]);
                });
                //                console.log(this.evenServicesName.join());
                eventServiceJoin = this.evenServicesName.join();
                this.eventServiceJoin1.push(eventServiceJoin);

                this.eventServiceIDs.push(this.serviceIds);

                //this.eventServiceJoinIds.push(this.eventServiceJoin);

                //call load events here
                return this.loadevents();
            });

        }

    }

    getChair(chairName: string): number {
        if (chairName =="TX Room1")
            return 0
        else if (chairName == "TX Room2")
            return 1
        else if (chairName == "Pedicure 1")
            return 2
        else if (chairName == "Pedicure 2")
            return 3
        else if (chairName == "Pedicure 3")
            return 4
        else if (chairName == "Manicure 1")
            return 5
        else if (chairName == "Manicure 2")
            return 6
        else if (chairName == "Threading")
            return 7
        else 
            return 0
    }

    loadevents(): void {
        const eventService: string[] = [];
        this.events = [];
        if (this.eventServiceJoin1.length == this.filteredEvents.length) {
            for (var i: number = 0; i < this.eventServiceJoin1.length; i++) {

                //Select Color as per stylist & Load the Resources
                if (this.filteredEvents[i].stylist_title == "Dave") {
                    this.eventColor = colors.red;
                    this.eventType = "danger";

                }
                else if (this.filteredEvents[i].stylist_title == "Monika") {
                    this.eventColor = colors.blue;
                    this.eventType = "info";
                }
                else {
                    this.eventColor = colors.yellow;
                    this.eventType = "warning";
                }



                ////Select Color as per stylist & Load the Resources
                if (this.filteredEvents[i].chair == "TX Room1" || this.filteredEvents[i].chair == "TX Room2") {
                    this.eventColor = colors.red;
                    
                    
                }
                else if (this.filteredEvents[i].chair == "Manicure 1" || this.filteredEvents[i].chair == "Manicure 2") {
                    this.eventColor = colors.green;
                    this.eventType = "info";
                }
                else if (this.filteredEvents[i].chair == "Pedicure 1" || this.filteredEvents[i].chair == "Pedicure 2" || this.filteredEvents[i].chair == "Pedicure 3")  {
                    this.eventColor = colors.blue;
                    this.eventType = "info";
                }
                else {
                    this.eventColor = colors.yellow;
                    this.eventType = "warning";
                }


                //get all services in new array
                /*           
                           var z = this._caleventService.getFirebaseServiceData(this.filteredEvents[i].$key);
                           z.snapshotChanges().subscribe(item => {
                               this.eventService = [];
                               this.evenServicesName = [];
                               item.forEach(element => {
                                   var y = element.payload.toJSON();
                                   // y["$key"] = element.key;
                                   this.eventService.push(y as Services);
                                   this.evenServicesName.push(y["name"]);
                                   console.log(y["name"]);
                               });
                               console.log(this.evenServicesName.join());
                               this.eventServiceJoin = this.evenServicesName.join();
                           });
               
                

                console.log(i);
                console.log(this.filteredEvents[i].name);
                console.log(this.eventServiceJoin1[i]);
 */

                var l = this.getChair(this.filteredEvents[i].chair);
                this.events.push({
                    title: this.filteredEvents[i].stylist_title,
                    start: new Date(this.filteredEvents[i].start),
                    end: new Date(this.filteredEvents[i].end),
                    color: this.eventColor,
                    draggable: false,
                    allDay: false,
                    resizable: {
                        beforeStart: false,
                        afterEnd: false
                    },
                    meta: {

                        $key: this.filteredEvents[i].$key,
                        name: this.filteredEvents[i].name,
                        phone: this.filteredEvents[i].phone,
                        landline:  this.filteredEvents[i].landline,
                        service: this.eventServiceJoin1[i],
                        gender: this.filteredEvents[i].gender,
                        stylist_title: this.filteredEvents[i].stylist_title,
                        notes: this.filteredEvents[i].notes,
                        serviceOptionIds: this.eventServiceIDs[i],
                        type: this.eventType,
                        chair: chairs[l]

                    }
                });
                this.refresh.next();



            };
        }
        
    }


    open(modalAppointmentForm) {
        this.createModalRef = this.modal.open(modalAppointmentForm, { size: 'lg' });

    }

    onCloseModal(message: string) {
        console.log(message);


    }
    //events: CalendarEvent[] = [{
    //    title: 'An event smith',
    //    color: colors.yellow,
    //    start: addHours(startOfDay(new Date()), 5),
    //    meta: {
    //        chair: chairs[0]
    //    },
    //    resizable: {
    //        beforeStart: true,
    //        afterEnd: true
    //    },
    //    draggable: true
    //}, {
    //    title: 'Another event dae',
    //    color: colors.blue,
    //    start: addHours(startOfDay(new Date()), 2),
    //    meta: {
    //        chair: chairs[1]
    //    },
    //    resizable: {
    //        beforeStart: true,
    //        afterEnd: true
    //    },
    //    draggable: true
    //}, {
    //    title: 'An 3rd event smith',
    //    color: colors.red,
    //    start: addHours(startOfDay(new Date()), 7),
    //    meta: {
    //        chair: chairs[0]
    //    },
    //    resizable: {
    //        beforeStart: true,
    //        afterEnd: true
    //    },
    //    draggable: true
    //    },
    //    {
    //        title: 'Apna Event dae',
    //        color: colors.red,
    //        start: addHours(startOfDay(new Date()), -7),
    //        meta: {
    //            chair: chairs[1]
    //        },
    //        resizable: {
    //            beforeStart: true,
    //            afterEnd: true
    //        },
    //        draggable: true
    //    },
    //    {
    //        title: 'Ek hoor Event bhatti',
    //        color: colors.red,
    //        start: addHours(startOfDay(new Date()), -7),
    //        meta: {
    //            chair: chairs[2]
    //        },
    //        resizable: {
    //            beforeStart: true,
    //            afterEnd: true
    //        },
    //        draggable: true
    //    }];

    //eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    //    event.start = newStart;
    //    event.end = newEnd;
    //    this.refresh.next();
    //}
    

    userChanged({ event, newUser }) {
        event.meta.chair = newUser;
        this.refresh.next();
    }
    ngOnChanges(changes) {
        //this.getCurrentNotes()
      }

  //get selected date note notes

  getCurrentNotes(val: Date){

    //I was trying to fetch data directly from firebase then thought to do locally with selectedNote 
    // var z = this._caleventService.getFirebaseDayNotesData();
    // z.snapshotChanges().subscribe(item => {
      
    //     this.todaysNotes = "not found";
    //     this.selectedNote =null;
    //     item.forEach(element => {
    //         var y = element.payload.toJSON();
    //         y["$key"] = element.key;
    //         console.log(y); 
    //         var dummy = y["day"];
    //          /* for double digits date (10-31) */
    //          if (dummy.substring(8, 10) == val.getDate().toString() && dummy.substring(4, 7) == this.monthNames[val.getMonth()] && dummy.substring(11, 15) == val.getFullYear().toString()) {
    //             this.todaysNotes = y["notes"];
    //             this.selectedNote = y as DayNotes;

    //         }
    //         /* for date with single digits (1-9) */
    //         else if (dummy.substring(9, 10) == val.getDate().toString() && dummy.substring(4, 7) == this.monthNames[val.getMonth()] && dummy.substring(11, 15) == val.getFullYear().toString()) {
    //             this.todaysNotes = y["notes"];
    //             this.selectedNote = y as DayNotes;
    //         }
            
    //     });
        
    //     console.log(this.viewDate);
    //     console.log(this.todaysNotes);
    //     console.log(this.selectedNote);
        
    // });

    this.todaysNotes = "";
    this.selectedNote =null;
    for (var i: number = 0; i < this.allDayNotes.length; i++) {
       
         /* for double digits date (10-31) */
         if (this.allDayNotes[i].day.toString().substring(8, 10) == val.getDate().toString() && this.allDayNotes[i].day.toString().substring(4, 7) == this.monthNames[val.getMonth()] && this.allDayNotes[i].day.toString().substring(11, 15) == val.getFullYear().toString()) {
            this.todaysNotes = this.allDayNotes[i].notes;
            this.selectedNote = this.allDayNotes[i];

        }
         /* for date with single digits (1-9) */
         else if (this.allDayNotes[i].day.toString().substring(9, 10) == val.getDate().toString() && this.allDayNotes[i].day.toString().substring(4, 7) == this.monthNames[val.getMonth()] && this.allDayNotes[i].day.toString().substring(11, 15) == val.getFullYear().toString()) {
            this.todaysNotes = this.allDayNotes[i].notes;
            this.selectedNote = this.allDayNotes[i];
        }
    }
    
        console.log(this.todaysNotes);
        console.log(this.selectedNote);

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
        if (
            (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
            events.length === 0
        ) {
            this.activeDayIsOpen = false;
        } else {
            this.activeDayIsOpen = true;
            this.viewDate = date;
        }
    }
   
    this.view= 'day';
}

//Group events in Month view 
beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(cell => {
        const groups: any = {};
        cell.events.forEach((event: CalendarEvent<{ type: string }>) => {
            groups[event.meta.type] = groups[event.meta.type] || [];
            groups[event.meta.type].push(event);
        });
        cell['eventGroups'] = Object.entries(groups);
    });
}



}
