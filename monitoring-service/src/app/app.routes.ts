import { Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'nav',
        pathMatch: 'full',
    },
    {
        path: 'nav',
        component: NavbarComponent,
    },
];
