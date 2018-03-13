import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { CalEventsService } from '../../cal-events.service';
import { DayNotes } from '../dayNotes.model';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-day-notes',
  templateUrl: './day-notes.component.html',
  styleUrls: ['./day-notes.component.css']
})
export class DayNotesComponent implements OnInit {

  @Input() viewDate: Date = new Date();
  
  @Input() createModalRef: NgbModalRef;

  @Input() selectedNote: DayNotes;
  constructor(public _caleventService: CalEventsService, private tostr: ToastrService) { }

  ngOnInit() {
    this.resetForm();
    
  }

  resetForm(form?: NgForm) {
    if (form != null)
            form.reset();
    
    console.log(this._caleventService.selectedNote);
    console.log(this.selectedNote);
    //this._caleventService.selectedNote = this.selectedNote  
    
    this._caleventService.selectedNote = Object.assign({}, this.selectedNote); 
    
    if(this._caleventService.selectedNote == null){
    this._caleventService.selectedNote = {       
      $key: null,
      day: null,
      notes: ''
    }
  }
    
  }
  onSubmit(form: NgForm) {
    if (form.value.$key == null) {
      this._caleventService.insertDayNote(form.value);
      console.log("Create DayNote: ");
      console.log(form.value);
      //this.closeModal.emit('create');
     
      
    }
    else {
      this._caleventService.updateDayNotes(form.value);
      console.log("Update DayNote: ");
      console.log(form.value);
      //this.closeModal.emit('update');
    }

    //this.resetForm(form);
    if (this.createModalRef != null)
            this.createModalRef.close();

    this.tostr.success('Submitted Succcessfully', 'Day Notes');
  }

  
}
