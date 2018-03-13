import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy  } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Subject } from 'rxjs/Subject';

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

import { eventsAPI } from '../../app.component';
import { Services } from '../../cal-utils/services.model';
import { CalEventsService } from '../../cal-events.service'
import { AuthService } from '../../core/auth.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

const colors: any = {
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
    selector: 'app-resources',
    templateUrl: './resources.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    modalRef: NgbModalRef;

    constructor(public _caleventService: CalEventsService, public auth: AuthService, public modal: NgbModal) { }

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
    }

    public sortByDate(): void {
        this.filteredEvents.sort((a: eventsAPI, b: eventsAPI) => {

            this.dat1 = new Date(a.start);
            this.dat2 = new Date(b.start);
            return this.dat1.getTime() - this.dat2.getTime();


        });
    }

    view: string = 'day';

    viewDate: Date = new Date();

    eventColor: any;
    eventType: string;
    /* used to sort the dates in filteredevents array */
    dat1: Date = new Date();
    dat2: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    refresh: Subject<any> = new Subject();



    createModalRef: NgbModalRef;
    events2: CalendarEvent[] = [
        {
            start: new Date('2018-02-23'),
            title: 'One day excluded event',
            color: colors.red
        },
        {
            start: new Date(),
            title: 'aaj da event',
            color: colors.red
        },
        {
            start: new Date('2018-02-24'),
            title: 'Multiple weeks',
            color: colors.blue
        },
        {
            start: new Date('2018-02-25'),
            title: 'Multiple weeks event',
            color: colors.blue
        }
    ];

    events1: CalendarEvent[] = [
        {
            start: subDays(startOfDay(new Date()), 1),
            end: addDays(new Date(), 1),
            title: 'A 3 day event',
            color: colors.red

        },
        {
            start: startOfDay(new Date()),
            title: 'An event with no end date',
            color: colors.yellow

        },
        {
            start: subDays(endOfMonth(new Date()), 3),
            end: addDays(endOfMonth(new Date()), 3),
            title: 'A long event that spans 2 months',
            color: colors.blue
        },
        {
            start: addHours(startOfDay(new Date()), 2),
            end: new Date(),
            title: 'A draggable and resizable event',
            color: colors.yellow,
            resizable: {
                beforeStart: true,
                afterEnd: true
            },
            draggable: true
        }
    ];


    /*   events: CalendarEvent[] = []; */
    events: Array<CalendarEvent<{ $key: string; name: string, phone: string, service: string, gender: string, stylist_title: string, notes: string, chair: string, serviceOptionIds: number[], type: string }>> = []

    eventsResource1: Array<CalendarEvent<{ $key: string; name: string, phone: string, service: string, gender: string, stylist_title: string, notes: string, chair: string, serviceOptionIds: number[], type: string }>> = []


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
            chair: event.meta.chair
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



    loadevents(): void {
        const eventService: string[] = [];
        this.events = [];
        if (this.eventServiceJoin1.length == this.filteredEvents.length) {
            for (var i: number = 0; i < this.eventServiceJoin1.length; i++) {

                //Select Color as per stylist & Load the Resources
                if (this.filteredEvents[i].stylist_title == "Gurpreet") {
                    this.eventColor = colors.red;
                    this.eventType = "danger";
                    this.eventsResource1.push(this.events[i]);
                }
                else if (this.filteredEvents[i].stylist_title == "Meena") {
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
                       // landline:  this.filteredEvents[i].landline,
                        service: this.eventServiceJoin1[i],
                        gender: this.filteredEvents[i].gender,
                        stylist_title: this.filteredEvents[i].stylist_title,
                        notes: this.filteredEvents[i].notes,
                        serviceOptionIds: this.eventServiceIDs[i],
                        type: this.eventType,
                        chair: this.filteredEvents[i].chair

                    }
                });
                this.refresh.next();



            };
        }
        this.loadResources();
    }


    //Thi function will load the data to eventsResource1
    loadResources(): void {
        this.eventsResource1 = [];
        for (var i: number = 0; i < this.events.length; i++)
        {
            if (this.events[i].meta.stylist_title == "Meena")
            {
                this.eventsResource1.push(this.events[i]);
            }
        }
    }

    open(modalAppointmentForm) {
        this.createModalRef = this.modal.open(modalAppointmentForm, { size: 'lg' });

    }

}
