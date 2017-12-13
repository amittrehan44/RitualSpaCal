import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { CalEventsService } from './../../cal-events.service'
import { NgForm } from '@angular/forms'
import { Subject } from 'rxjs/Subject';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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

@Component({
  selector: 'app-appointment-input',
  templateUrl: './appointment-input.component.html',
  styleUrls: ['./appointment-input.component.css']
})
export class AppointmentInputComponent implements OnInit {
   //@ViewChild('modalContent') modalContent: TemplateRef<any>;
    @Input() modalRef: NgbModalRef;
    @Input() createModalRef: NgbModalRef;
    @Output() closeModal: EventEmitter<string> = new EventEmitter<string>();
    
    refresh: Subject<any> = new Subject();

    //mask: any[] = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    mask: any[] = ['+', '1', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    mask1: any[] = [/[0-9]/, ':', /[0-6]/, /[0-9]/];
    mask2: any[] = [/^[0-9]+(\.[0-9]{1,2})?$/];

    constructor(private _caleventService: CalEventsService, private modal: NgbModal) { }

    ngOnInit() {
        
        this.resetForm();
       

        setTimeout(() => {
            this.setStartData();
        });
    }





    resetForm(form?: NgForm) {
        if (form != null)
            form.reset();
        this._caleventService.selectedAppointment = {
            $key: null,
            name: '',
            phone: '',
            service: '',
            start: new Date(),
            end: new Date(),
            stylist_title: '',
            gender: '',
            notes: ''
        }
    }

    onSubmit(form: NgForm) {
        if (form.value.$key == null) {
            this._caleventService.insertAppointment(form.value);
            console.log("On Create: ");
            console.log(form.value);
            this.closeModal.emit('create');
            
        }
        else {
            this._caleventService.updateAppointment(form.value);
            console.log("On Update: ");
            console.log(form.value);
            this.closeModal.emit('update');
            
            }
        this.resetForm(form);
       
        if (this.createModalRef != null)
            this.createModalRef.close();

        if (this.modalRef != null)
            this.modalRef.close();

       
        
    }

    onDelete(form: NgForm) {
        if (confirm('Are you sure to delete this record ?') == true) {
            this._caleventService.deleteAppointment(form.value.$key);
            this.resetForm(form);

            if (this.modalRef != null)
                this.modalRef.close();
        }
    }

    setStartData() {
        if (this._caleventService.contextDate != null)
            {
            this._caleventService.selectedAppointment.start = this._caleventService.contextDate;
            this._caleventService.selectedAppointment.end = this._caleventService.contextDate;
            this._caleventService.contextDate = null;
        }
        if (this._caleventService.appointmentToUpdate != null) {
            this._caleventService.selectedAppointment = this._caleventService.appointmentToUpdate;
            this._caleventService.appointmentToUpdate = null;
        }
        
    }
}
