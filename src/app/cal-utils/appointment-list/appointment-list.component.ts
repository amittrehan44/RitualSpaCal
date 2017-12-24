import { Component, OnInit } from '@angular/core';
import { CalEventsService } from './../../cal-events.service'
import { eventsAPI } from './../../app.component';
import { DatePipe } from '@angular/common';

import { Services } from './../services.model';



import {
    CalendarEventTitleFormatter
} from 'angular-calendar';
import { CustomEventTitleFormatter } from './../../custom-event-title-formatter.service';


@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
    styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
    appointmentlist: eventsAPI[];
    filteredProducts: eventsAPI[] = [];

    dat1: Date = new Date();
    dat2: Date = new Date();

    //variable for services
    eventService: Array<Services[]>;
    eventService1: Array<Services[]> =[];
    _listFilterName: string;
    get listFilterName(): string {
        return this._listFilterName;
    }
    set listFilterName(value: string) {
        this._listFilterName = value;
        this.filteredProducts = this.listFilterName ? this.performFilter(this.listFilterName, "name") : this.appointmentlist;
    }


    _listFilterStylist: string;
    get listFilterStylist(): string {
        return this._listFilterStylist;
    }
    set listFilterStylist(value: string) {
        this._listFilterStylist = value;
        this.filteredProducts = this._listFilterStylist ? this.performFilter(this.listFilterStylist, "stylist") : this.appointmentlist;
    }


    _listFilterPhone: string;
    get listFilterPhone(): string {
        return this._listFilterPhone;
    }
    set listFilterPhone(value: string) {
        this._listFilterPhone = value;
        this.filteredProducts = this._listFilterPhone ? this.performFilter(this.listFilterPhone, "phone") : this.appointmentlist;
    }

    _listFilterServices: string;
    get listFilterServices(): string {
        return this._listFilterServices;
    }
    set listFilterServices(value: string) {
        this._listFilterServices = value;
        this.filteredProducts = this._listFilterServices ? this.performFilter(this.listFilterServices, "services") : this.appointmentlist;
    }

    _listFilterGender: string;
    get listFilterGender(): string {
        return this._listFilterGender;
    }
    set listFilterGender(value: string) {
        this._listFilterGender = value;
        this.filteredProducts = this._listFilterGender ? this.performFilter(this.listFilterGender, "gender") : this.appointmentlist;
    }

    _listFilterNotes: string;
    get listFilterNotes(): string {
        return this._listFilterNotes;
    }
    set listFilterNotes(value: string) {
        this._listFilterNotes = value;
        this.filteredProducts = this._listFilterNotes ? this.performFilter(this.listFilterNotes, "notes") : this.appointmentlist;
    }

    constructor(private _caleventService: CalEventsService) { }


    performFilter(filterBy: string, coloumnFilter: string): eventsAPI[] {
        filterBy = filterBy.toLocaleLowerCase();

        if (coloumnFilter == "name") {
            return this.filteredProducts.filter((appointment: eventsAPI) =>
            appointment.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
        }
        else if (coloumnFilter == "stylist") {
            return this.filteredProducts.filter((appointment: eventsAPI) =>
                appointment.stylist_title.toLocaleLowerCase().indexOf(filterBy) !== -1);
        }
        else if (coloumnFilter == "phone") {
            
            return this.filteredProducts.filter((appointment: eventsAPI) =>
                appointment.phone.toLocaleLowerCase().indexOf(filterBy) !== -1);
        }
        else if (coloumnFilter == "services") {
  /*         
            return this.filteredProducts.filter((appointment: eventsAPI) =>
                appointment.service.toLocaleLowerCase().indexOf(filterBy) !== -1);
  */      
        }
        else if (coloumnFilter == "gender") {
       
            return this.filteredProducts.filter((appointment: eventsAPI) =>
                appointment.gender.toLocaleLowerCase().indexOf(filterBy) !== -1);
        }
        else if (coloumnFilter == "notes") {
           
            return this.filteredProducts.filter((appointment: eventsAPI) =>
                appointment.notes.toLocaleLowerCase().indexOf(filterBy) !== -1);
        }
    }


    ngOnInit() {


        var x = this._caleventService.getFirebaseData();
        x.snapshotChanges().subscribe(item => {
            this.appointmentlist = [];
            this.eventService = [];

            item.forEach(element => {
                var y = element.payload.toJSON();
                y["$key"] = element.key;
                this.appointmentlist.push(y as eventsAPI); 

                //add services in array
                this.eventService.push(y["service"]);           
            });
            this.filteredProducts = this.appointmentlist;
            this.sortByDate();
            console.log(this.eventService);
            this.eventService.forEach(service => {
                this.eventService1.push(service);
                console.log(this.eventService1);
                this.eventService1.forEach(item => {

                                   console.log(item[0]);
                    item.forEach(item1 => {
                        console.log(item1);
                    });
                });
               
            });
            
        });

        
        
    }

    public sortByDate(): void {
        this.filteredProducts.sort((a: eventsAPI, b: eventsAPI) => {

            this.dat1 = new Date(a.start);
            this.dat2 = new Date(b.start);
            return this.dat2.getTime() - this.dat1.getTime();

          
        });
       
    }

    

    onItemClick(app: eventsAPI) {
        this._caleventService.selectedAppointment = Object.assign({}, app);
    }

}
