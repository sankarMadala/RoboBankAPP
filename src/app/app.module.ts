import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { DataTableModule } from 'angular2-datatable';
import { StatementProcessorComponent } from './statement-processor/statement-processor.component';
import { FileUtil } from './statement-processor/file.util';
import { Constants } from './statement-processor/statement-processor.constants';
import { FormsModule } from '@angular/forms';
@NgModule({
    //put all your modules here
    //The imports key in the context of an @NgModule defines additional modules 
    //that will be imported into the current module
    imports: [
        BrowserModule,
        RouterModule,
        DataTableModule,
        FormsModule      ,
        RouterModule.forRoot(appRoutes, {
            useHash: true
        })
    ],
    // put all your components / directives / pipes here
    declarations: [
        AppComponent,
        StatementProcessorComponent,
        
    ],

    // put all your services here
    providers: [
        FileUtil,
        Constants,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],

    bootstrap: [AppComponent]
})
export class AppModule { }
