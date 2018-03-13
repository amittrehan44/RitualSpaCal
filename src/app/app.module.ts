//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
//import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
//import { CalendarModule } from 'angular-calendar';
//import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

//import { CalUtilsModule } from './cal-utils/cal-utils.module';
import { AppComponent } from './app.component';
import { ResourcesComponent } from './cal-utils/resources/resources.component';
import { MyCalendarModule } from './my-calendar/my-calendar.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './core/auth.guard';
import { AllResourcesModule } from './all-resources/all-resources.module';
import { CalEventsService } from './cal-events.service';
import { CalendarEventTitleFormatter } from 'angular-calendar';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.service';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent
  ],
  imports: [
      BrowserModule,
      //BrowserAnimationsModule,
      NgbModule.forRoot(),
      //NgbModalModule.forRoot(),
      //FormsModule,
      //CalendarModule.forRoot(),
      //CalUtilsModule,
      HttpClientModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireDatabaseModule,
      //CalendarModule,
      MyCalendarModule,
      AppRoutingModule,
      CoreModule,
      AllResourcesModule,
      BrowserAnimationsModule, // required animations module
      ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [AuthGuard,CalEventsService,
    {
        provide: CalendarEventTitleFormatter,
        useClass: CustomEventTitleFormatter
    }],
  exports: [AppComponent
            
            ],
    bootstrap: [AppComponent]
})
export class AppModule { }
