import { Routes, RouterModule } from '@angular/router';
import {StatementProcessorComponent} from './statement-processor/statement-processor.component';


export const appRoutes: Routes = [
    { 
        path: 'roboStatement', 
        component: StatementProcessorComponent,
    },
    { 
        path: '', 
        component: StatementProcessorComponent, 
    }
];
