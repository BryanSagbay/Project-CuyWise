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
                path: 'diagramas',
                component: DiagramasComponent,
            },
            {
                path: 'imagenes',
                component: ImagenesComponent,
            },
            {
                path: 'monitoreo',
                component: MonitoreoComponent,
            },
            {
                path: 'animales',
                component: AnimalesComponent,
            },
            {
                path: 'mediciones',
                component: MedicionesComponent,
            },
            {
                path: 'logs',
                component: LogsComponent,
            },
            {
                path: '',
                redirectTo: 'diagramas',
                pathMatch: 'full',
            },
    ],
    },
];

