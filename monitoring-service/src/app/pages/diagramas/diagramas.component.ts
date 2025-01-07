import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DbConexionService } from '../../service/db-conexion.service';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-diagramas',
  templateUrl: './diagramas.component.html',
  styleUrls: ['./diagramas.component.css'],
})
export class DiagramasComponent implements OnInit {
  
  constructor(private DbConexionService: DbConexionService) {
  }
  
  ngOnInit(): void {

    //grafica 1
    this.DbConexionService.getDistribucionRazas().subscribe(data => {
      const razas = data.map(item => item.raza);
      const cantidades = data.map(item => parseInt(item.cantidad, 10));
    
      const options = {
        chart: {
          id: 'distribucion-razas',
          type: 'pie',
          height: 350
        },
        series: cantidades,
        labels: razas,
        title: {
          text: 'Distribución de Razas',
          align: 'center'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#distribucion-razas'), options);
      chart.render();
    });
    
    //grafica 2
    this.DbConexionService.getAnimalesActivosInactivos().subscribe(data => {
      const actInac = data.map(item => item.activo ? 'Activos' : 'Inactivos');
      const cantidades = data.map(item => parseInt(item.cantidad, 10)); 
    
      const options = {
        chart: {
          id: 'activo-inactivo',
          type: 'bar'
        },
        series: [
          {
            name: 'Cantidades',
            data: cantidades
          }
        ],
        xaxis: {
          categories: actInac,
          title: {
            text: 'Activos/Inactivos'
          }
        },
        title: {
          text: 'Activos y Inactivos',
          align: 'center'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#activo-inactivo'), options);
      chart.render();
    });
    
    //grafica 3
    this.DbConexionService.getEvolucionPesoPorAnimal().subscribe(data => {

      const fechasPA = data.map(item => item.fecha_medicion.split('T')[0]); 
      const pesosPA = data.map(item => item.peso); 

      const options = {
        chart: {
          id: 'evolucion-peso',
          type: 'line',
        },
        series: [
          {
            name: 'Peso',
            data: pesosPA
          }
        ],
        xaxis: {
          categories: fechasPA,
          title: {
            text: 'Fecha de Medición'
          }
        },
        title: {
          text: 'Evolucion Peso-Fecha',
          align: 'center'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#evolucion-peso'), options);
      chart.render();
    });
    
    //grafica 4
    this.DbConexionService.getEventosPorTipo().subscribe(data => {
      const tiposEv = data.map(item => item.tipo_evento);
      const cantidadesEv = data.map(item => parseInt(item.cantidad, 10));
    
      const options = {
        chart: {
          id: 'eventos-tipo',
          type: 'bar'
        },
        series: [
          {
            name: 'Cantidad',
            data: cantidadesEv
          }
        ],
        xaxis: {
          categories: tiposEv,
          title: {
            text: 'Tipo de Evento'
          }
        },
        title: {
          text: 'Eventos por Tipo',
          align: 'center'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#eventos-tipo'), options);
      chart.render();
    });

    //grafica 5
    this.DbConexionService.getMedicionesPorAnimal().subscribe(data => {
      const labelsA = data.map(item => `Animal ${item.animal_id}`); 
      const cantidadesMA = data.map(item => parseInt(item.cantidad, 10));
    
      const options = {
        chart: {
          id: 'mediciones-animal',
          type: 'bar'
        },
        series: [
          {
            name: 'Cantidad',
            data: cantidadesMA
          }
        ],
        xaxis: {
          categories: labelsA,
          title: {
            text: 'Animales'
          }
        },
        title: {
          text: 'Mediciones por Animal',
          align: 'center'
        }
      };

      const chart = new ApexCharts(document.querySelector('#mediciones-animal'), options);
      chart.render();
    });
  
    //grafica 6
    this.DbConexionService.getAnimalesPorMesAnio().subscribe(data => {
      const labelsxMA = data.map(item => item.mes_anio); // Extraer meses
      const cantidadesxMA = data.map(item => parseInt(item.cantidad, 10)); // Extraer cantidades
    
      const options = {
        chart: {
          id: 'animales-mes',
          type: 'line'
        },
        series: [
          {
            name: 'Cantidad de Animales',
            data: cantidadesxMA
          }
        ],
        xaxis: {
          categories: labelsxMA,
          title: {
            text: 'Mes'
          }
        },
        title: {
          text: 'Animales por Mes',
          align: 'center'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#animales-mes'), options);
      chart.render();
    });

    //grafica 7
    this.DbConexionService.getPromedioPesoPorRaza().subscribe(data => {
      const razasPR = data.map(item => item.raza);
      const pesosPromedioPR = data.map(item => item.peso_promedio);
    
      const options = {
        chart: {
          id: 'promedio-peso',
          type: 'bar'
        },
        series: [
          {
            name: 'Peso Promedio',
            data: pesosPromedioPR
          }
        ],
        xaxis: {
          categories: razasPR,
          title: {
            text: 'Raza'
          }
        },
        title: {
          text: 'Promedio de Peso por Raza',
          align: 'center'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#promedio-peso'), options);
      chart.render();
    });
    
    //grafica 8
    this.DbConexionService.getRelacionPesoFecha().subscribe(data => {
      const fechasRPF = data.map(item => new Date(item.fecha_medicion).toLocaleDateString());
      const pesosRPF = data.map(item => item.peso);
    
      const options = {
        chart: {
          id: 'grafica-relacion-peso-fecha',
          type: 'line'
        },
        series: [
          {
            name: 'Peso',
            data: pesosRPF
          }
        ],
        xaxis: {
          categories: fechasRPF,
          title: {
            text: 'Fecha de Medición'
          }
        },
        title: {
          text: 'Relación Peso-Fecha',
          align: 'center'
        }
      };
    
      const chart = new ApexCharts(document.querySelector('#relacion-peso'), options);
      chart.render();
    });
    
    }

  }