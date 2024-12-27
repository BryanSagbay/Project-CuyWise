import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DiagramasComponent } from './pages/diagramas/diagramas.component';
import { ImagenesComponent } from './pages/imagenes/imagenes.component';
import { MonitoreoComponent } from './pages/monitoreo/monitoreo.component';
import { LogsComponent } from './pages/logs/logs.component';
import { MedicionesComponent } from './pages/mediciones/mediciones.component';
import { AnimalesComponent } from './pages/animales/animales.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
    children: [
    {
        path: '',
        redirectTo: 'diagramas',
        pathMatch: 'full' },
    {
        path: 'diagramas',
        component: DiagramasComponent,
    },
    {
        path: '',
        redirectTo: 'imagenes',
        pathMatch: 'full' },
    {
        path: 'imagenes',
        component: ImagenesComponent,
    },
    {
        path: '',
        redirectTo: 'monitoreo',
        pathMatch: 'full' },
    {
        path: 'monitoreo',
        component: MonitoreoComponent,
    },
    {
        path: '',
        redirectTo: 'animales',
        pathMatch: 'full' },
    {
        path: 'animales',
        component: AnimalesComponent,
    },
    {
        path: '',
        redirectTo: 'mediciones',
        pathMatch: 'full' },
    {
        path: 'mediciones',
        component: MedicionesComponent,
    },
    {
        path: '',
        redirectTo: 'logs',
        pathMatch: 'full' },
    {
        path: 'logs',
        component: LogsComponent,
    },
    ],
},
];
