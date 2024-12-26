import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DiagramasComponent } from './pages/diagramas/diagramas.component';
import { ImagenesComponent } from './pages/imagenes/imagenes.component';
import { ViewDBComponent } from './pages/view-db/view-db.component';
import { MonitoreoComponent } from './pages/monitoreo/monitoreo.component';

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
        redirectTo: 'database',
        pathMatch: 'full' },
    {
        path: 'database',
        component: ViewDBComponent,
    },
    {
        path: '',
        redirectTo: 'monitoreo',
        pathMatch: 'full' },
    {
        path: 'monitoreo',
        component: MonitoreoComponent,
    },
    ],
},
];
