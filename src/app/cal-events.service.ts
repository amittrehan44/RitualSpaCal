import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';



import {
    CalendarEvent,
    CalendarEventAction
} from 'angular-calendar';

import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
    addMinutes
} from 'date-fns';


import { eventsAPI } from './app.component';

import { Services } from './cal-utils/services.model';

import { DayNotes } from './all-resources/dayNotes.model';

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


@Injectable()
export class CalEventsService {
    

    appointmentList: AngularFireList<any>;
    selectedAppointment: eventsAPI;
    appointmentToUpdate: eventsAPI;
    //e164: string;
    contextDate: Date;
    contextResource: string;

    /* logic for setting duration*/
    duration: number = 0;

    _durationString1: string;
    _durationString: string;
    get durationString(): string {        
        return this._durationString;        
    }
    set durationString(value: string) {
        this._durationString = value;
        console.log("inside setter duration");
        console.log(this._durationString);
        this.duration = Number(this._durationString.substring(0, 1)) * 60 + Number(this._durationString.substring(2, 4));
        console.log(this.duration);
        //this.filteredProducts = this.listFilterName ? this.performFilter(this.listFilterName, "name") : this.appointmentlist;
    }

    //Variables for multiselect services
    selectService: Services[];
    serviceList: AngularFireList<any>;
    optionsMultiselect: number[];


    //vaiables for DayNotes
    dayNotes: AngularFireList<any>;
    //dayNote: DayNotes;
    selectedNote: DayNotes = {
        $key: "s",
        day: new Date(), 
        notes: "d"
    };

    //variable to switch resourceview on click and use this date on ngOninit of all resources
    clickedDate: Date = new Date();

    constructor(private _http: HttpClient, private firebase: AngularFireDatabase) { }

    /* getting data from firebase*/

    getFirebaseData() {
         this.appointmentList = this.firebase.list('appointments');       
        return this.appointmentList;
    }


    // getting service data from firebase
    getFirebaseServiceData(key: string) {
        this.serviceList = this.firebase.list('appointments/'+key+'/service');
        return this.serviceList;
    }

    // getting DayNotes from FireBase
    getFirebaseDayNotesData() {
        this.dayNotes = this.firebase.list('dayNotes');       
       return this.dayNotes;
   }

     /* below function to insert data from firebase is not working  */
    insertAppointment(appointment: eventsAPI) {
        //this.e164 = "+1" + appointment.phone.substring(4, 7) + appointment.phone.substring(9, 12) + appointment.phone.substring(13, 17);
        //console.log(this.e164);
        
        this.appointmentList.push({
            
            name: appointment.name,
            phone: appointment.phone,
            landline: appointment.landline,
            service: this.selectService,
            gender: appointment.gender,
            stylist_title: appointment.stylist_title,
            start: appointment.start.toString(),
            //end: appointment.end.toString(),
            end: addMinutes(appointment.start, this.duration).toString(),
            notes: appointment.notes,
            chair: appointment.chair
           
        });
        console.log("inside insertAppointment Start:" + appointment.start.toString());
    }

    insertDayNote(dayNote: DayNotes) {
        this.dayNotes.push({
            day: dayNote.day.toString(),
            notes: dayNote.notes
        })
    }

    updateAppointment(appointment: eventsAPI) {
        //this.e164 = "+1" + appointment.phone.substring(4, 7) + appointment.phone.substring(9, 12) + appointment.phone.substring(13, 17);
        this.appointmentList.update(appointment.$key, {
            name: appointment.name,
            phone: appointment.phone,
            landline: appointment.landline,
            service: this.selectService,
            gender: appointment.gender,
            stylist_title: appointment.stylist_title,
            start: appointment.start.toString(),
            //end: appointment.end.toString(),
            end: addMinutes(appointment.start, this.duration).toString(),
            notes: appointment.notes,
            chair: appointment.chair
        })
    }

    updateDayNotes(dayNote: DayNotes) {
        //this.e164 = "+1" + appointment.phone.substring(4, 7) + appointment.phone.substring(9, 12) + appointment.phone.substring(13, 17);
        this.dayNotes.update(dayNote.$key, {
            day: dayNote.day.toString(),
            notes: dayNote.notes
           
        })
        if(dayNote.notes=='')
        this.dayNotes.remove(dayNote.$key);
    }
   
/* 
Instead of observable CalenderEvent we are passing data with eventsAPI so comment below 
    getCalEvents(): Observable<CalendarEvent[]> {
        return this._http.get<CalendarEvent[]>(this._eventUrl)
            .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    
No need of even below function as now we are using firebase instead of _eventURL
    getCalEvents(): Observable<eventsAPI[]> {
        return this._http.get<eventsAPI[]>(this._eventUrl)
 //           .do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }


    private handleError(err: HttpErrorResponse) {
        console.error(err.message);
        return Observable.throw(err.message);
    }

*/
    /* Moving below arrya in API  */

 /* getCalEvents(): CalendarEvent[] {
        return [
            {
                start: subDays(startOfDay(new Date()), 1),
                end: addDays(new Date(), 1),
                title: 'A 3 day event',
                color: colors.red,
                
            },
            {
                start: startOfDay(new Date()),
                title: 'An event with no end date',
                color: colors.yellow,
                
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
    }
  */


 deleteDayNote(key: string) {
    this.dayNotes.remove(key);
}

    deleteAppointment(key: string) {
        this.appointmentList.remove(key);
    }
}
